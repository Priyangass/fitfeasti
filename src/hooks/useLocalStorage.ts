import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export interface SavedRecipe {
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
  imageUrl?: string;
  savedAt: string;
  ingredients: string[];
}

export interface SavedWorkoutPlan {
  id: string;
  name: string;
  days: WorkoutDay[];
  createdAt: string;
  goal: string;
}

export interface WorkoutDay {
  day: string;
  exercises: Exercise[];
  restDay?: boolean;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  notes?: string;
}
