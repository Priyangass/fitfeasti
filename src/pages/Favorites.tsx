import DashboardNav from '@/components/DashboardNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocalStorage, SavedRecipe, SavedWorkoutPlan } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { Heart, Dumbbell, Utensils, Trash2, Clock, Flame, Calendar, Download } from 'lucide-react';

export default function Favorites() {
  const { toast } = useToast();
  const [savedRecipes, setSavedRecipes] = useLocalStorage<SavedRecipe[]>('fitfeast_saved_recipes', []);
  const [savedWorkouts, setSavedWorkouts] = useLocalStorage<SavedWorkoutPlan[]>('fitfeast_saved_workouts', []);

  const removeRecipe = (id: string) => {
    setSavedRecipes(savedRecipes.filter(r => r.id !== id));
    toast({
      title: "Recipe removed",
      description: "Recipe has been removed from your favorites.",
    });
  };

  const removeWorkout = (id: string) => {
    setSavedWorkouts(savedWorkouts.filter(w => w.id !== id));
    toast({
      title: "Workout removed",
      description: "Workout plan has been removed from your favorites.",
    });
  };

  const exportWeeklyPlan = () => {
    const latestWorkout = savedWorkouts[0];
    const latestRecipes = savedRecipes.slice(0, 7);
    
    let exportText = "=== FitFeast AI Weekly Plan ===\n\n";
    
    if (latestWorkout) {
      exportText += "📋 WORKOUT PLAN\n";
      exportText += `Goal: ${latestWorkout.goal.replace('_', ' ')}\n\n`;
      latestWorkout.days.forEach(day => {
        exportText += `${day.day}:\n`;
        if (day.restDay) {
          exportText += "  • Rest Day\n";
        } else {
          day.exercises.forEach(ex => {
            exportText += `  • ${ex.name}: ${ex.sets} sets × ${ex.reps}\n`;
          });
        }
        exportText += "\n";
      });
    }
    
    if (latestRecipes.length > 0) {
      exportText += "\n🍽️ SAVED RECIPES\n\n";
      latestRecipes.forEach((recipe, i) => {
        exportText += `${i + 1}. ${recipe.name} (${recipe.prepTime})\n`;
        exportText += `   Calories: ${recipe.nutrition.calories} | Protein: ${recipe.nutrition.protein}g\n\n`;
      });
    }
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fitfeast-weekly-plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Plan Exported!",
      description: "Your weekly plan has been downloaded.",
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2 flex items-center gap-3">
              <Heart className="w-8 h-8 text-accent" />
              Your Favorites
            </h1>
            <p className="text-muted-foreground">
              All your saved workouts and recipes in one place.
            </p>
          </div>
          {(savedWorkouts.length > 0 || savedRecipes.length > 0) && (
            <Button onClick={exportWeeklyPlan} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Weekly Plan
            </Button>
          )}
        </div>

        <Tabs defaultValue="workouts" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="workouts" className="gap-2">
              <Dumbbell className="w-4 h-4" />
              Workouts ({savedWorkouts.length})
            </TabsTrigger>
            <TabsTrigger value="recipes" className="gap-2">
              <Utensils className="w-4 h-4" />
              Recipes ({savedRecipes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workouts">
            {savedWorkouts.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center">
                  <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No saved workouts yet</h3>
                  <p className="text-muted-foreground">
                    Generate a workout plan and save it to see it here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {savedWorkouts.map((workout) => (
                  <Card key={workout.id} className="shadow-card">
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          {workout.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{goalLabels[workout.goal]}</Badge>
                          <span>Created {new Date(workout.createdAt).toLocaleDateString()}</span>
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeWorkout(workout.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[100px]">Day</TableHead>
                              <TableHead>Exercise</TableHead>
                              <TableHead className="text-center">Sets</TableHead>
                              <TableHead className="text-center">Reps</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {workout.days.map((day, dayIndex) => (
                              day.restDay ? (
                                <TableRow key={dayIndex}>
                                  <TableCell className="font-medium">{day.day}</TableCell>
                                  <TableCell colSpan={3}>
                                    <Badge variant="secondary">Rest Day</Badge>
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
                                  </TableRow>
                                ))
                              )
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recipes">
            {savedRecipes.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center">
                  <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No saved recipes yet</h3>
                  <p className="text-muted-foreground">
                    Generate recipes and save your favorites to see them here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRecipes.map((recipe) => (
                  <Card key={recipe.id} className="shadow-card overflow-hidden">
                    {recipe.imageUrl && (
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="w-3 h-3" />
                            {recipe.prepTime}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive -mr-2"
                          onClick={() => removeRecipe(recipe.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <h3 className="text-lg font-display font-semibold mb-3">{recipe.name}</h3>
                      
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          {recipe.nutrition.calories} kcal
                        </span>
                        <span>•</span>
                        <span>{recipe.nutrition.protein}g protein</span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-3">
                        Saved {new Date(recipe.savedAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
