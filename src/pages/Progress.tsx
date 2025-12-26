import DashboardNav from '@/components/DashboardNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGamification } from '@/hooks/useGamification';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage, SavedRecipe, SavedWorkoutPlan } from '@/hooks/useLocalStorage';
import { 
  Trophy, Flame, Target, TrendingUp, Star, Award, 
  Zap, Calendar, Dumbbell, Utensils 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

export default function ProgressPage() {
  const { userStats } = useAuth();
  const [savedRecipes] = useLocalStorage<SavedRecipe[]>('fitfeast_saved_recipes', []);
  const [savedWorkouts] = useLocalStorage<SavedWorkoutPlan[]>('fitfeast_saved_workouts', []);
  
  const {
    currentStreak,
    longestStreak,
    totalWorkoutsCompleted,
    totalRecipesMade,
    earnedBadges,
    unearnedBadges,
    dailyChallenges,
    weeklyProgress,
  } = useGamification();

  const todaysChallenge = dailyChallenges[0];

  // Mock weekly data for charts
  const mockWeeklyData = [
    { day: 'Mon', workouts: 1, calories: 2200 },
    { day: 'Tue', workouts: 0, calories: 1800 },
    { day: 'Wed', workouts: 1, calories: 2100 },
    { day: 'Thu', workouts: 1, calories: 2300 },
    { day: 'Fri', workouts: 0, calories: 1900 },
    { day: 'Sat', workouts: 1, calories: 2000 },
    { day: 'Sun', workouts: 0, calories: 2100 },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <DashboardNav />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            Your Progress
          </h1>
          <p className="text-muted-foreground">
            Track your achievements, streaks, and fitness journey.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Flame className="w-5 h-5" />}
            label="Current Streak"
            value={`${currentStreak} days`}
            color="text-accent"
            bgColor="bg-accent/10"
            highlight={currentStreak >= 7}
          />
          <StatCard
            icon={<Star className="w-5 h-5" />}
            label="Longest Streak"
            value={`${longestStreak} days`}
            color="text-warning"
            bgColor="bg-warning/10"
          />
          <StatCard
            icon={<Dumbbell className="w-5 h-5" />}
            label="Workouts"
            value={`${savedWorkouts.length} saved`}
            color="text-primary"
            bgColor="bg-primary/10"
          />
          <StatCard
            icon={<Utensils className="w-5 h-5" />}
            label="Recipes"
            value={`${savedRecipes.length} saved`}
            color="text-success"
            bgColor="bg-success/10"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Daily Challenge */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-warning" />
                Daily Challenge
              </CardTitle>
              <CardDescription>Complete today's challenge</CardDescription>
            </CardHeader>
            <CardContent>
              {todaysChallenge && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                    <h3 className="font-semibold mb-1">{todaysChallenge.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {todaysChallenge.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(todaysChallenge.current / todaysChallenge.target) * 100} 
                        className="flex-1 h-2"
                      />
                      <span className="text-sm font-medium">
                        {todaysChallenge.current}/{todaysChallenge.target}
                      </span>
                    </div>
                  </div>
                  {todaysChallenge.completed && (
                    <Badge className="w-full justify-center py-2 bg-success text-success-foreground">
                      ✅ Challenge Complete!
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Activity Chart */}
          <Card className="shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Weekly Activity
              </CardTitle>
              <CardDescription>Your workout frequency this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockWeeklyData}>
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis hide domain={[0, 2]} />
                    <Tooltip />
                    <Bar dataKey="workouts" name="Workouts" radius={[6, 6, 0, 0]}>
                      {mockWeeklyData.map((entry, index) => (
                        <Cell 
                          key={index} 
                          fill={entry.workouts > 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted))'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card className="shadow-card lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-warning" />
                Badges & Achievements
              </CardTitle>
              <CardDescription>
                {earnedBadges.length} of {earnedBadges.length + unearnedBadges.length} badges earned
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Earned Badges */}
                {earnedBadges.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Earned</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {earnedBadges.map((badge) => (
                        <div
                          key={badge.id}
                          className="p-4 rounded-xl bg-gradient-to-br from-warning/20 to-warning/5 border border-warning/30 text-center"
                        >
                          <div className="text-3xl mb-2">{badge.icon}</div>
                          <p className="font-semibold text-sm">{badge.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Locked Badges */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Locked</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {unearnedBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="p-4 rounded-xl bg-muted/50 border border-border text-center opacity-60"
                      >
                        <div className="text-3xl mb-2 grayscale">{badge.icon}</div>
                        <p className="font-semibold text-sm">{badge.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calorie Tracking Chart */}
          <Card className="shadow-card lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" />
                Weekly Calorie Tracking
              </CardTitle>
              <CardDescription>Your daily calorie intake this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockWeeklyData}>
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis domain={[1500, 2500]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="calories" 
                      name="Calories"
                      stroke="hsl(var(--accent))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function StatCard({ 
  icon, label, value, color, bgColor, highlight 
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  bgColor: string;
  highlight?: boolean;
}) {
  return (
    <Card className={`shadow-card ${highlight ? 'ring-2 ring-accent' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center ${color}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-lg font-semibold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
