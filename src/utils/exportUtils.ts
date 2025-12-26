import { SavedRecipe, SavedWorkoutPlan } from '@/hooks/useLocalStorage';

export function exportToPDF(workouts: SavedWorkoutPlan[], recipes: SavedRecipe[]) {
  // Create a printable HTML document
  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>FitFeast AI - Weekly Plan</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
        h1 { color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 10px; }
        h2 { color: #374151; margin-top: 30px; }
        h3 { color: #6b7280; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; }
        th { background-color: #f3f4f6; }
        .recipe-card { background: #f9fafb; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .nutrition { display: flex; gap: 20px; margin-top: 10px; }
        .nutrition span { background: #e5e7eb; padding: 5px 10px; border-radius: 4px; font-size: 12px; }
        .rest-day { color: #9ca3af; font-style: italic; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <h1>🏋️ FitFeast AI - Your Weekly Plan</h1>
      <p>Generated on ${new Date().toLocaleDateString()}</p>
      
      ${workouts.length > 0 ? `
        <h2>💪 Workout Plans</h2>
        ${workouts.map(workout => `
          <h3>${workout.name}</h3>
          <p><strong>Goal:</strong> ${workout.goal.replace('_', ' ')}</p>
          <table>
            <tr>
              <th>Day</th>
              <th>Exercise</th>
              <th>Sets</th>
              <th>Reps</th>
              <th>Notes</th>
            </tr>
            ${workout.days.map(day => 
              day.restDay 
                ? `<tr><td>${day.day}</td><td colspan="4" class="rest-day">Rest Day - Recovery & Stretching</td></tr>`
                : day.exercises.map((ex, i) => `
                    <tr>
                      ${i === 0 ? `<td rowspan="${day.exercises.length}">${day.day}</td>` : ''}
                      <td>${ex.name}</td>
                      <td>${ex.sets}</td>
                      <td>${ex.reps}</td>
                      <td>${ex.notes || '-'}</td>
                    </tr>
                  `).join('')
            ).join('')}
          </table>
        `).join('')}
      ` : ''}
      
      ${recipes.length > 0 ? `
        <h2>🍽️ Saved Recipes</h2>
        ${recipes.map(recipe => `
          <div class="recipe-card">
            <h3>${recipe.name}</h3>
            <p><strong>Prep Time:</strong> ${recipe.prepTime}</p>
            <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
            <p><strong>Instructions:</strong></p>
            <ol>
              ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
            </ol>
            <div class="nutrition">
              <span>Calories: ${recipe.nutrition.calories}</span>
              <span>Protein: ${recipe.nutrition.protein}g</span>
              <span>Carbs: ${recipe.nutrition.carbs}g</span>
              <span>Fats: ${recipe.nutrition.fats}g</span>
            </div>
          </div>
        `).join('')}
      ` : ''}
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  }
}

export function exportToCSV(workouts: SavedWorkoutPlan[], recipes: SavedRecipe[]) {
  let csv = 'Type,Name,Details,Extra Info\n';

  workouts.forEach(workout => {
    workout.days.forEach(day => {
      if (day.restDay) {
        csv += `Workout,${workout.name},${day.day},Rest Day\n`;
      } else {
        day.exercises.forEach(ex => {
          csv += `Workout,${workout.name},"${day.day}: ${ex.name}","${ex.sets} sets x ${ex.reps}"\n`;
        });
      }
    });
  });

  recipes.forEach(recipe => {
    csv += `Recipe,${recipe.name},"${recipe.prepTime}","Cal: ${recipe.nutrition.calories}, P: ${recipe.nutrition.protein}g, C: ${recipe.nutrition.carbs}g, F: ${recipe.nutrition.fats}g"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fitfeast-plan-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function generateGroceryList(recipes: SavedRecipe[]): string[] {
  const allIngredients = recipes.flatMap(r => r.ingredients);
  const uniqueIngredients = [...new Set(allIngredients.map(i => i.toLowerCase()))];
  return uniqueIngredients.sort();
}
