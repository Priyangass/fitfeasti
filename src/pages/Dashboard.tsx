import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardNav from '@/components/DashboardNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage, SavedRecipe, SavedWorkoutPlan } from '@/hooks/useLocalStorage';
import { Dumbbell, Utensils, Target, TrendingUp, ArrowRight, Flame, Activity, Heart } from 'lucide-react';

export default function Dashboard() {
  const { user, userStats, updateUserStats } = useAuth();
  const [savedRecipes] = useLocalStorage<SavedRecipe[]>('fitfeast_saved_recipes', []);
  const [savedWorkouts] = useLocalStorage<SavedWorkoutPlan[]>('fitfeast_saved_workouts', []);
  
  const [height, setHeight] = useState(userStats?.height?.toString() || '');
  const [weight, setWeight] = useState(userStats?.weight?.toString() || '');
  const [age, setAge] = useState(userStats?.age?.toString() || '');
  const [goal, setGoal] = useState(userStats?.goal || '');
  const [activityLevel, setActivityLevel] = useState(userStats?.activityLevel || '');

  const handleSaveStats = () => {
    if (height && weight && age && goal && activityLevel) {
      updateUserStats({
        height: parseFloat(height),
        weight: parseFloat(weight),
        age: parseInt(age),
        goal: goal as any,
        activityLevel: activityLevel as any,
      });
    }
  };

  const calculateCalories = () => {
    if (!userStats) return null;
    
    // Basic BMR calculation (Mifflin-St Jeor)
    const bmr = 10 * userStats.weight + 6.25 * userStats.height - 5 * userStats.age + 5;
    
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    
    const tdee = bmr * (activityMultipliers[userStats.activityLevel] || 1.55);
    
    const goalAdjustments: Record<string, number> = {
      weight_loss: -500,
      muscle_gain: 300,
      maintenance: 0,
      endurance: 200,
    };
    
    return Math.round(tdee + (goalAdjustments[userStats.goal] || 0));
  };

  const calories = calculateCalories();

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <DashboardNav />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's your personalized health dashboard.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Flame className="w-5 h-5" />}
            label="Daily Calories"
            value={calories ? `${calories} kcal` : '--'}
            color="text-accent"
            bgColor="bg-accent/10"
          />
          <StatCard
            icon={<Dumbbell className="w-5 h-5" />}
            label="Saved Workouts"
            value={savedWorkouts.length.toString()}
            color="text-primary"
            bgColor="bg-primary/10"
          />
          <StatCard
            icon={<Utensils className="w-5 h-5" />}
            label="Saved Recipes"
            value={savedRecipes.length.toString()}
            color="text-success"
            bgColor="bg-success/10"
          />
          <StatCard
            icon={<Activity className="w-5 h-5" />}
            label="Activity Level"
            value={userStats?.activityLevel?.replace('_', ' ') || 'Not set'}
            color="text-warning"
            bgColor="bg-warning/10"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* User Stats Form */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Your Fitness Profile
              </CardTitle>
              <CardDescription>
                Update your stats for personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goal">Fitness Goal</Label>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger>
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
              
              <div className="space-y-2">
                <Label htmlFor="activity">Activity Level</Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little exercise)</SelectItem>
                    <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                    <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                    <SelectItem value="very_active">Very Active (intense daily)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleSaveStats} className="w-full">
                Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Card className="shadow-card card-hover">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <Dumbbell className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-display font-semibold mb-2">Generate Workout Plan</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Get a personalized 7-day workout plan based on your goals and fitness level.
                    </p>
                    <Link to="/dashboard/workouts">
                      <Button className="gap-2">
                        Create Plan
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card card-hover">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success mb-4">
                      <Utensils className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-display font-semibold mb-2">Generate Recipes</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Enter your available ingredients and get delicious, healthy recipe ideas.
                    </p>
                    <Link to="/dashboard/recipes">
                      <Button variant="secondary" className="gap-2">
                        Find Recipes
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card card-hover">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                      <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-display font-semibold mb-2">Your Favorites</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      View your saved workout plans and favorite recipes in one place.
                    </p>
                    <Link to="/dashboard/favorites">
                      <Button variant="outline" className="gap-2">
                        View Favorites
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color, bgColor }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  bgColor: string;
}) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center ${color}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-lg font-semibold capitalize">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
