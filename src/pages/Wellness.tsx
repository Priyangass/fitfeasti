import { useState } from 'react';
import DashboardNav from '@/components/DashboardNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useWellness, SleepLog } from '@/hooks/useWellness';
import { useToast } from '@/hooks/use-toast';
import { 
  Droplet, Moon, Brain, Plus, Minus, Target, 
  Clock, Sparkles, Play, Pause, RotateCcw 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Wellness() {
  const { toast } = useToast();
  const {
    getTodaysHydration,
    addWaterGlass,
    removeWaterGlass,
    logSleep,
    getTodaysSleep,
    getWeeklyHydration,
    getWeeklySleep,
    meditationMinutes,
    addMeditationMinutes,
    dailyWaterGoal,
  } = useWellness();

  const [sleepHours, setSleepHours] = useState('');
  const [sleepQuality, setSleepQuality] = useState<SleepLog['quality']>('good');
  const [bedTime, setBedTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');

  const [meditationTimer, setMeditationTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(5);

  const todaysHydration = getTodaysHydration();
  const todaysSleep = getTodaysSleep();
  const hydrationProgress = (todaysHydration.glasses / dailyWaterGoal) * 100;

  const handleLogSleep = () => {
    if (!sleepHours || !bedTime || !wakeTime) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all sleep details.',
        variant: 'destructive',
      });
      return;
    }
    logSleep(parseFloat(sleepHours), sleepQuality, bedTime, wakeTime);
    toast({
      title: 'Sleep logged!',
      description: `${sleepHours} hours of ${sleepQuality} sleep recorded.`,
    });
  };

  const startMeditation = () => {
    setMeditationTimer(selectedDuration * 60);
    setIsTimerRunning(true);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setMeditationTimer(0);
  };

  const completeMeditation = () => {
    addMeditationMinutes(selectedDuration);
    toast({
      title: 'Meditation complete!',
      description: `You've meditated for ${selectedDuration} minutes. Total: ${meditationMinutes + selectedDuration} mins.`,
    });
    resetTimer();
  };

  // Timer effect
  useState(() => {
    if (!isTimerRunning || meditationTimer <= 0) return;
    const interval = setInterval(() => {
      setMeditationTimer(prev => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          completeMeditation();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const weeklyHydration = getWeeklyHydration();
  const weeklySleep = getWeeklySleep();

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <DashboardNav />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2 flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            Wellness Center
          </h1>
          <p className="text-muted-foreground">
            Track your hydration, sleep, and practice mindfulness.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Hydration Tracker */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-blue-500" />
                Hydration Tracker
              </CardTitle>
              <CardDescription>Stay hydrated throughout the day</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-display font-bold mb-2">
                  {todaysHydration.glasses} / {dailyWaterGoal}
                </div>
                <p className="text-muted-foreground">glasses of water today</p>
              </div>

              <Progress value={Math.min(hydrationProgress, 100)} className="h-3" />

              {hydrationProgress >= 100 && (
                <Badge className="w-full justify-center py-2 bg-success text-success-foreground">
                  🎉 Daily goal achieved!
                </Badge>
              )}

              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={removeWaterGlass}
                  disabled={todaysHydration.glasses <= 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Droplet className="w-10 h-10 text-blue-500" />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    addWaterGlass();
                    toast({ title: '+1 glass of water! 💧' });
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Weekly hydration chart */}
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyHydration}>
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(val) => new Date(val).toLocaleDateString('en', { weekday: 'short' })}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis hide />
                    <Tooltip 
                      formatter={(value) => [`${value} glasses`, 'Water']}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Bar dataKey="glasses" radius={[4, 4, 0, 0]}>
                      {weeklyHydration.map((entry, index) => (
                        <Cell 
                          key={index} 
                          fill={entry.glasses >= entry.goal ? 'hsl(var(--success))' : 'hsl(210 100% 60%)'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Sleep Tracker */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-500" />
                Sleep Tracker
              </CardTitle>
              <CardDescription>Log your sleep to track patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaysSleep ? (
                <div className="p-4 rounded-lg bg-indigo-500/10 text-center">
                  <p className="text-2xl font-bold">{todaysSleep.hours}h</p>
                  <Badge variant="secondary" className="mt-2">
                    Quality: {todaysSleep.quality}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    {todaysSleep.bedTime} → {todaysSleep.wakeTime}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Hours slept</Label>
                      <Input
                        type="number"
                        step="0.5"
                        placeholder="7.5"
                        value={sleepHours}
                        onChange={(e) => setSleepHours(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Quality</Label>
                      <Select value={sleepQuality} onValueChange={(v) => setSleepQuality(v as SleepLog['quality'])}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="poor">Poor 😴</SelectItem>
                          <SelectItem value="fair">Fair 😐</SelectItem>
                          <SelectItem value="good">Good 🙂</SelectItem>
                          <SelectItem value="excellent">Excellent 😊</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Bed time</Label>
                      <Input
                        type="time"
                        value={bedTime}
                        onChange={(e) => setBedTime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Wake time</Label>
                      <Input
                        type="time"
                        value={wakeTime}
                        onChange={(e) => setWakeTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={handleLogSleep} className="w-full">
                    Log Sleep
                  </Button>
                </>
              )}

              {/* Weekly sleep chart */}
              <div className="h-32 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklySleep}>
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(val) => new Date(val).toLocaleDateString('en', { weekday: 'short' })}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis hide domain={[0, 12]} />
                    <Tooltip 
                      formatter={(value) => [`${value}h`, 'Sleep']}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Bar dataKey="hours" fill="hsl(245 60% 60%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Guided Meditation */}
          <Card className="shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Guided Meditation
              </CardTitle>
              <CardDescription>
                Take a moment to relax and breathe. Total meditation time: {meditationMinutes} minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                {/* Timer Display */}
                <div className="relative">
                  <div className="w-48 h-48 rounded-full border-8 border-purple-500/20 flex items-center justify-center">
                    <div className="text-center">
                      {meditationTimer > 0 ? (
                        <p className="text-4xl font-display font-bold">{formatTime(meditationTimer)}</p>
                      ) : (
                        <p className="text-4xl font-display font-bold">{selectedDuration}:00</p>
                      )}
                      <p className="text-sm text-muted-foreground">minutes</p>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {[5, 10, 15, 20].map((mins) => (
                      <Button
                        key={mins}
                        variant={selectedDuration === mins ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedDuration(mins)}
                        disabled={isTimerRunning}
                      >
                        {mins}m
                      </Button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {meditationTimer === 0 ? (
                      <Button onClick={startMeditation} className="gap-2">
                        <Play className="w-4 h-4" />
                        Start Meditation
                      </Button>
                    ) : (
                      <>
                        <Button onClick={toggleTimer} variant="outline" className="gap-2">
                          {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          {isTimerRunning ? 'Pause' : 'Resume'}
                        </Button>
                        <Button onClick={resetTimer} variant="ghost" className="gap-2">
                          <RotateCcw className="w-4 h-4" />
                          Reset
                        </Button>
                      </>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground max-w-xs">
                    Find a comfortable position, close your eyes, and focus on your breath. 
                    Let go of any tension with each exhale.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
