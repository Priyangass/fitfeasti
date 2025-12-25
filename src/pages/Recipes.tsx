import { useState } from 'react';
import DashboardNav from '@/components/DashboardNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage, SavedRecipe } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { Utensils, Sparkles, Loader2, Heart, Clock, Flame, Beef, Wheat, Droplet } from 'lucide-react';

interface GeneratedRecipe {
  id: string;
  name: string;
  prepTime: string;
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  imageUrl: string;
  ingredients: string[];
}

const mockRecipeDatabase: GeneratedRecipe[] = [
  {
    id: '1',
    name: 'Mediterranean Chicken Salad',
    prepTime: '20 min',
    instructions: [
      'Season chicken breast with olive oil, oregano, salt, and pepper.',
      'Grill chicken for 6-7 minutes per side until cooked through.',
      'Let chicken rest for 5 minutes, then slice into strips.',
      'Toss mixed greens with cucumber, tomatoes, olives, and feta cheese.',
      'Top with sliced chicken and drizzle with lemon vinaigrette.',
      'Serve immediately with a side of pita bread.'
    ],
    nutrition: { calories: 380, protein: 35, carbs: 18, fats: 20 },
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    ingredients: ['chicken', 'lettuce', 'tomato', 'cucumber', 'feta', 'olives']
  },
  {
    id: '2',
    name: 'Protein-Packed Egg Scramble',
    prepTime: '15 min',
    instructions: [
      'Whisk 3 eggs with a splash of milk, salt, and pepper.',
      'Heat olive oil in a non-stick pan over medium heat.',
      'Add diced bell peppers and onions, sauté for 3 minutes.',
      'Pour in egg mixture and stir gently with a spatula.',
      'Add crumbled feta cheese and fresh spinach.',
      'Cook until eggs are set but still creamy. Serve with whole grain toast.'
    ],
    nutrition: { calories: 320, protein: 24, carbs: 12, fats: 22 },
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
    ingredients: ['eggs', 'spinach', 'peppers', 'onion', 'feta']
  },
  {
    id: '3',
    name: 'Asian Stir-Fry Bowl',
    prepTime: '25 min',
    instructions: [
      'Cook rice or noodles according to package instructions.',
      'Cut tofu or chicken into cubes and season with soy sauce.',
      'Heat sesame oil in a wok over high heat.',
      'Stir-fry protein until golden, about 5-6 minutes. Set aside.',
      'Add broccoli, carrots, and snap peas to the wok. Stir-fry for 4 minutes.',
      'Return protein to wok, add sauce (soy sauce, ginger, garlic, honey).',
      'Serve over rice with sesame seeds and green onions.'
    ],
    nutrition: { calories: 420, protein: 28, carbs: 45, fats: 16 },
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
    ingredients: ['rice', 'tofu', 'broccoli', 'carrots', 'soy sauce']
  },
  {
    id: '4',
    name: 'Avocado Toast with Poached Egg',
    prepTime: '10 min',
    instructions: [
      'Toast whole grain bread until golden and crispy.',
      'Mash ripe avocado with lime juice, salt, and chili flakes.',
      'Bring water to a gentle simmer and add a splash of vinegar.',
      'Create a whirlpool and gently drop in the egg. Cook for 3 minutes.',
      'Spread avocado mash on toast and top with poached egg.',
      'Garnish with everything bagel seasoning and microgreens.'
    ],
    nutrition: { calories: 290, protein: 12, carbs: 25, fats: 18 },
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
    ingredients: ['avocado', 'eggs', 'bread', 'lime']
  },
  {
    id: '5',
    name: 'Quinoa Buddha Bowl',
    prepTime: '30 min',
    instructions: [
      'Cook quinoa according to package instructions.',
      'Roast chickpeas with cumin, paprika, and olive oil at 400°F for 20 mins.',
      'Steam or roast sweet potato cubes until tender.',
      'Prepare tahini dressing: mix tahini, lemon juice, garlic, and water.',
      'Arrange quinoa, roasted veggies, chickpeas, and fresh greens in a bowl.',
      'Drizzle with tahini dressing and sprinkle with seeds.'
    ],
    nutrition: { calories: 450, protein: 18, carbs: 58, fats: 19 },
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    ingredients: ['quinoa', 'chickpeas', 'sweet potato', 'tahini', 'greens']
  },
  {
    id: '6',
    name: 'Grilled Salmon with Veggies',
    prepTime: '25 min',
    instructions: [
      'Season salmon fillet with lemon, dill, salt, and pepper.',
      'Toss asparagus and zucchini with olive oil and garlic.',
      'Preheat grill to medium-high heat.',
      'Grill salmon skin-side down for 4-5 minutes per side.',
      'Grill vegetables alongside until tender with char marks.',
      'Serve salmon on a bed of vegetables with lemon wedges.'
    ],
    nutrition: { calories: 380, protein: 42, carbs: 12, fats: 20 },
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
    ingredients: ['salmon', 'asparagus', 'zucchini', 'lemon', 'garlic']
  }
];

export default function Recipes() {
  const { toast } = useToast();
  const [savedRecipes, setSavedRecipes] = useLocalStorage<SavedRecipe[]>('fitfeast_saved_recipes', []);
  const [ingredients, setIngredients] = useState('');
  const [generatedRecipes, setGeneratedRecipes] = useState<GeneratedRecipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRecipes = async () => {
    if (!ingredients.trim()) {
      toast({
        title: "Please enter ingredients",
        description: "Type at least one ingredient to generate recipes.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Filter recipes based on ingredients (simple matching)
    const inputIngredients = ingredients.toLowerCase().split(',').map(i => i.trim());
    const matchedRecipes = mockRecipeDatabase.filter(recipe =>
      recipe.ingredients.some(ing => 
        inputIngredients.some(input => ing.includes(input) || input.includes(ing))
      )
    );
    
    // Return matched recipes or random selection if no matches
    const recipesToShow = matchedRecipes.length > 0 
      ? matchedRecipes.slice(0, 3)
      : mockRecipeDatabase.slice(0, 3);
    
    setGeneratedRecipes(recipesToShow);
    setIsGenerating(false);
    toast({
      title: "Recipes Generated!",
      description: `Found ${recipesToShow.length} delicious recipes for you.`,
    });
  };

  const saveRecipe = (recipe: GeneratedRecipe) => {
    const isAlreadySaved = savedRecipes.some(r => r.id === recipe.id);
    if (isAlreadySaved) {
      toast({
        title: "Already saved",
        description: "This recipe is already in your favorites.",
      });
      return;
    }

    const newSavedRecipe: SavedRecipe = {
      ...recipe,
      savedAt: new Date().toISOString(),
    };
    
    setSavedRecipes([newSavedRecipe, ...savedRecipes]);
    toast({
      title: "Recipe Saved!",
      description: `${recipe.name} has been added to your favorites.`,
    });
  };

  const isRecipeSaved = (id: string) => savedRecipes.some(r => r.id === id);

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <DashboardNav />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2 flex items-center gap-3">
            <Utensils className="w-8 h-8 text-success" />
            Recipe Generator
          </h1>
          <p className="text-muted-foreground">
            Enter your available ingredients and discover delicious, healthy recipes.
          </p>
        </div>

        {/* Ingredient Input */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              What's in Your Kitchen?
            </CardTitle>
            <CardDescription>
              Enter comma-separated ingredients (e.g., chicken, rice, broccoli, garlic)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="ingredients" className="sr-only">Ingredients</Label>
                <Input
                  id="ingredients"
                  placeholder="chicken, tomato, spinach, eggs..."
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  className="text-base"
                />
              </div>
              <Button onClick={generateRecipes} disabled={isGenerating} className="gap-2 bg-success hover:bg-success/90">
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Recipes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Recipes */}
        {generatedRecipes.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold">Your Recipes</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedRecipes.map((recipe, index) => (
                <Card 
                  key={recipe.id} 
                  className="shadow-card overflow-hidden card-hover animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.name}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      size="icon"
                      variant="secondary"
                      className={`absolute top-3 right-3 ${isRecipeSaved(recipe.id) ? 'bg-accent text-accent-foreground' : ''}`}
                      onClick={() => saveRecipe(recipe)}
                    >
                      <Heart className={`w-4 h-4 ${isRecipeSaved(recipe.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="w-3 h-3" />
                        {recipe.prepTime}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-display font-semibold mb-3">{recipe.name}</h3>
                    
                    {/* Nutrition Info */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <NutritionBadge icon={<Flame className="w-3 h-3" />} value={recipe.nutrition.calories} label="kcal" />
                      <NutritionBadge icon={<Beef className="w-3 h-3" />} value={recipe.nutrition.protein} label="g" />
                      <NutritionBadge icon={<Wheat className="w-3 h-3" />} value={recipe.nutrition.carbs} label="g" />
                      <NutritionBadge icon={<Droplet className="w-3 h-3" />} value={recipe.nutrition.fats} label="g" />
                    </div>
                    
                    {/* Instructions */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Instructions:</p>
                      <ol className="text-sm text-muted-foreground space-y-1">
                        {recipe.instructions.slice(0, 3).map((step, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-primary font-medium">{i + 1}.</span>
                            <span className="line-clamp-2">{step}</span>
                          </li>
                        ))}
                        {recipe.instructions.length > 3 && (
                          <li className="text-primary text-xs">+{recipe.instructions.length - 3} more steps</li>
                        )}
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function NutritionBadge({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
      <div className="text-muted-foreground mb-1">{icon}</div>
      <span className="text-sm font-semibold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
