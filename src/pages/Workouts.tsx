import { useState } from 'react';
import DashboardNav from '@/components/DashboardNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage, SavedWorkoutPlan, WorkoutDay, Exercise } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { Dumbbell, Sparkles, Loader2, Save, RefreshCw, Calendar } from 'lucide-react';

const mockWorkoutPlans: Record<string, WorkoutDay[]> = {
  weight_loss: [
    { day: 'Monday', exercises: [
      { name: 'Jump Rope', sets: 3, reps: '2 min', notes: 'Warm-up' },
      { name: 'Burpees', sets: 4, reps: '15' },
      { name: 'Mountain Climbers', sets: 3, reps: '30 sec' },
      { name: 'Kettlebell Swings', sets: 4, reps: '20' },
    ]},
    { day: 'Tuesday', exercises: [
      { name: 'Treadmill Running', sets: 1, reps: '30 min', notes: 'Moderate pace' },
      { name: 'Bodyweight Squats', sets: 4, reps: '20' },
      { name: 'Lunges', sets: 3, reps: '15 each leg' },
    ]},
    { day: 'Wednesday', restDay: true, exercises: [] },
    { day: 'Thursday', exercises: [
      { name: 'HIIT Circuit', sets: 5, reps: '45 sec on, 15 sec off' },
      { name: 'Box Jumps', sets: 4, reps: '12' },
      { name: 'Battle Ropes', sets: 3, reps: '30 sec' },
    ]},
    { day: 'Friday', exercises: [
      { name: 'Cycling', sets: 1, reps: '40 min' },
      { name: 'Plank', sets: 4, reps: '45 sec' },
      { name: 'Russian Twists', sets: 3, reps: '20' },
    ]},
    { day: 'Saturday', exercises: [
      { name: 'Swimming or Light Jog', sets: 1, reps: '45 min', notes: 'Active recovery' },
    ]},
    { day: 'Sunday', restDay: true, exercises: [] },
  ],
  muscle_gain: [
    { day: 'Monday', exercises: [
      { name: 'Bench Press', sets: 4, reps: '8-10', notes: 'Chest focus' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12' },
      { name: 'Cable Flyes', sets: 3, reps: '12-15' },
      { name: 'Tricep Pushdowns', sets: 3, reps: '12' },
    ]},
    { day: 'Tuesday', exercises: [
      { name: 'Deadlifts', sets: 4, reps: '6-8', notes: 'Back focus' },
      { name: 'Barbell Rows', sets: 4, reps: '8-10' },
      { name: 'Lat Pulldowns', sets: 3, reps: '10-12' },
      { name: 'Barbell Curls', sets: 3, reps: '12' },
    ]},
    { day: 'Wednesday', restDay: true, exercises: [] },
    { day: 'Thursday', exercises: [
      { name: 'Squats', sets: 4, reps: '8-10', notes: 'Leg focus' },
      { name: 'Leg Press', sets: 3, reps: '10-12' },
      { name: 'Romanian Deadlifts', sets: 3, reps: '10' },
      { name: 'Calf Raises', sets: 4, reps: '15' },
    ]},
    { day: 'Friday', exercises: [
      { name: 'Overhead Press', sets: 4, reps: '8-10', notes: 'Shoulder focus' },
      { name: 'Lateral Raises', sets: 3, reps: '12-15' },
      { name: 'Face Pulls', sets: 3, reps: '15' },
      { name: 'Shrugs', sets: 3, reps: '12' },
    ]},
    { day: 'Saturday', exercises: [
      { name: 'Pull-ups', sets: 4, reps: 'Max', notes: 'Full body' },
      { name: 'Dips', sets: 4, reps: 'Max' },
      { name: 'Farmer Walks', sets: 3, reps: '40m' },
    ]},
    { day: 'Sunday', restDay: true, exercises: [] },
  ],
  maintenance: [
    { day: 'Monday', exercises: [
      { name: 'Push-ups', sets: 3, reps: '15-20' },
      { name: 'Dumbbell Rows', sets: 3, reps: '12' },
      { name: 'Plank', sets: 3, reps: '45 sec' },
    ]},
    { day: 'Tuesday', exercises: [
      { name: 'Light Jogging', sets: 1, reps: '25 min' },
      { name: 'Stretching', sets: 1, reps: '15 min' },
    ]},
    { day: 'Wednesday', exercises: [
      { name: 'Bodyweight Squats', sets: 3, reps: '20' },
      { name: 'Lunges', sets: 3, reps: '12 each' },
      { name: 'Glute Bridges', sets: 3, reps: '15' },
    ]},
    { day: 'Thursday', restDay: true, exercises: [] },
    { day: 'Friday', exercises: [
      { name: 'Swimming or Cycling', sets: 1, reps: '30 min' },
      { name: 'Core Circuit', sets: 2, reps: '10 min' },
    ]},
    { day: 'Saturday', exercises: [
      { name: 'Full Body Light Workout', sets: 3, reps: '12 each exercise' },
    ]},
    { day: 'Sunday', restDay: true, exercises: [] },
  ],
  endurance: [
    { day: 'Monday', exercises: [
      { name: 'Long Distance Run', sets: 1, reps: '45 min', notes: 'Zone 2 pace' },
    ]},
    { day: 'Tuesday', exercises: [
      { name: 'Interval Training', sets: 8, reps: '400m fast, 200m recovery' },
      { name: 'Core Work', sets: 3, reps: '15 min' },
    ]},
    { day: 'Wednesday', exercises: [
      { name: 'Cross Training', sets: 1, reps: '40 min', notes: 'Cycling or swimming' },
    ]},
    { day: 'Thursday', exercises: [
      { name: 'Tempo Run', sets: 1, reps: '30 min', notes: 'Challenging but sustainable' },
    ]},
    { day: 'Friday', restDay: true, exercises: [] },
    { day: 'Saturday', exercises: [
      { name: 'Long Run', sets: 1, reps: '60-90 min', notes: 'Easy pace' },
    ]},
    { day: 'Sunday', exercises: [
      { name: 'Active Recovery', sets: 1, reps: '30 min', notes: 'Walk or light yoga' },
    ]},
  ],
};

export default function Workouts() {
  const { userStats } = useAuth();
  const { toast } = useToast();
  const [savedWorkouts, setSavedWorkouts] = useLocalStorage<SavedWorkoutPlan[]>('fitfeast_saved_workouts', []);
  const [selectedGoal, setSelectedGoal] = useState(userStats?.goal || 'weight_loss');
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutDay[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWorkout = async () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setWorkoutPlan(mockWorkoutPlans[selectedGoal] || mockWorkoutPlans.weight_loss);
    setIsGenerating(false);
    toast({
      title: "Workout Plan Generated!",
      description: "Your personalized 7-day workout plan is ready.",
    });
  };

  const saveWorkout = () => {
    if (!workoutPlan) return;
    
    const newWorkout: SavedWorkoutPlan = {
      id: crypto.randomUUID(),
      name: `${selectedGoal.replace('_', ' ')} Plan - ${new Date().toLocaleDateString()}`,
      days: workoutPlan,
      createdAt: new Date().toISOString(),
      goal: selectedGoal,
    };
    
    setSavedWorkouts([newWorkout, ...savedWorkouts]);
    toast({
      title: "Workout Saved!",
      description: "Your workout plan has been added to favorites.",
    });
  };

  const goalLabels: Record<string, string> = {
    weight_loss: 'Weight Loss',
    muscle_gain: 'Muscle Gain',
    maintenance: 'Maintenance',
    endurance: 'Endurance',
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <DashboardNav />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2 flex items-center gap-3">
            <Dumbbell className="w-8 h-8 text-primary" />
            Workout Generator
          </h1>
          <p className="text-muted-foreground">
            Generate a personalized 7-day workout plan based on your fitness goals.
          </p>
        </div>

        {/* Goal Selection */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Generate Your Plan
            </CardTitle>
            <CardDescription>
              Select your fitness goal and we'll create a customized workout plan for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
              <Select value={selectedGoal} onValueChange={(value) => setSelectedGoal(value as 'weight_loss' | 'muscle_gain' | 'maintenance' | 'endurance')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={generateWorkout} disabled={isGenerating} className="gap-2">
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Generate Plan
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Workout Plan Display */}
        {workoutPlan && (
          <Card className="shadow-card animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Your 7-Day {goalLabels[selectedGoal]} Plan
                </CardTitle>
                <CardDescription>
                  Follow this plan consistently for best results.
                </CardDescription>
              </div>
              <Button onClick={saveWorkout} variant="outline" className="gap-2">
                <Save className="w-4 h-4" />
                Save Plan
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Day</TableHead>
                      <TableHead>Exercise</TableHead>
                      <TableHead className="text-center">Sets</TableHead>
                      <TableHead className="text-center">Reps</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workoutPlan.map((day, dayIndex) => (
                      day.restDay ? (
                        <TableRow key={dayIndex}>
                          <TableCell className="font-medium">{day.day}</TableCell>
                          <TableCell colSpan={4}>
                            <Badge variant="secondary" className="bg-muted">
                              Rest Day - Recovery & Stretching
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ) : (
                        day.exercises.map((exercise, exIndex) => (
                          <TableRow key={`${dayIndex}-${exIndex}`}>
                            {exIndex === 0 && (
                              <TableCell 
                                className="font-medium align-top" 
                                rowSpan={day.exercises.length}
                              >
                                {day.day}
                              </TableCell>
                            )}
                            <TableCell>{exercise.name}</TableCell>
                            <TableCell className="text-center">{exercise.sets}</TableCell>
                            <TableCell className="text-center">{exercise.reps}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {exercise.notes || '-'}
                            </TableCell>
                          </TableRow>
                        ))
                      )
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
