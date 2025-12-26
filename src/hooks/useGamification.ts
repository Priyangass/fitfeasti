import { useLocalStorage } from './useLocalStorage';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  requirement: number;
  type: 'workouts' | 'recipes' | 'streak' | 'hydration';
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'workout' | 'recipe' | 'hydration' | 'steps';
  target: number;
  current: number;
  completed: boolean;
  date: string;
}

export interface GamificationData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  totalWorkoutsCompleted: number;
  totalRecipesMade: number;
  badges: Badge[];
  dailyChallenges: DailyChallenge[];
  weeklyProgress: { date: string; workouts: number; calories: number }[];
}

const defaultBadges: Badge[] = [
  { id: 'first_workout', name: 'First Steps', description: 'Complete your first workout', icon: '🏃', requirement: 1, type: 'workouts' },
  { id: 'workout_warrior', name: 'Workout Warrior', description: 'Complete 10 workouts', icon: '💪', requirement: 10, type: 'workouts' },
  { id: 'gym_legend', name: 'Gym Legend', description: 'Complete 50 workouts', icon: '🏆', requirement: 50, type: 'workouts' },
  { id: 'first_recipe', name: 'Chef Beginner', description: 'Save your first recipe', icon: '👨‍🍳', requirement: 1, type: 'recipes' },
  { id: 'home_chef', name: 'Home Chef', description: 'Save 10 recipes', icon: '🍳', requirement: 10, type: 'recipes' },
  { id: 'master_chef', name: 'Master Chef', description: 'Save 25 recipes', icon: '⭐', requirement: 25, type: 'recipes' },
  { id: 'streak_3', name: 'On Fire', description: 'Maintain a 3-day streak', icon: '🔥', requirement: 3, type: 'streak' },
  { id: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🌟', requirement: 7, type: 'streak' },
  { id: 'streak_30', name: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '🎖️', requirement: 30, type: 'streak' },
  { id: 'hydration_hero', name: 'Hydration Hero', description: 'Meet water goal for 7 days', icon: '💧', requirement: 7, type: 'hydration' },
];

const generateDailyChallenge = (): DailyChallenge => {
  const challenges = [
    { title: 'Quick Workout', description: 'Complete a 15-minute workout', type: 'workout' as const, target: 1 },
    { title: 'Try New Recipe', description: 'Save a new healthy recipe', type: 'recipe' as const, target: 1 },
    { title: 'Stay Hydrated', description: 'Drink 8 glasses of water', type: 'hydration' as const, target: 8 },
    { title: 'Move More', description: 'Take 5000 steps today', type: 'steps' as const, target: 5000 },
  ];
  const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
  return {
    id: crypto.randomUUID(),
    ...randomChallenge,
    current: 0,
    completed: false,
    date: new Date().toISOString().split('T')[0],
  };
};

const defaultData: GamificationData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  totalWorkoutsCompleted: 0,
  totalRecipesMade: 0,
  badges: defaultBadges,
  dailyChallenges: [generateDailyChallenge()],
  weeklyProgress: [],
};

export function useGamification() {
  const [data, setData] = useLocalStorage<GamificationData>('fitfeast_gamification', defaultData);

  const updateStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    setData(prev => {
      let newStreak = prev.currentStreak;
      
      if (prev.lastActiveDate === today) {
        return prev; // Already active today
      } else if (prev.lastActiveDate === yesterday) {
        newStreak = prev.currentStreak + 1;
      } else {
        newStreak = 1; // Start new streak
      }

      // Check streak badges
      const updatedBadges = prev.badges.map(badge => {
        if (badge.type === 'streak' && !badge.earnedAt && newStreak >= badge.requirement) {
          return { ...badge, earnedAt: new Date().toISOString() };
        }
        return badge;
      });

      return {
        ...prev,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastActiveDate: today,
        badges: updatedBadges,
      };
    });
  };

  const logWorkout = () => {
    setData(prev => {
      const newTotal = prev.totalWorkoutsCompleted + 1;
      const updatedBadges = prev.badges.map(badge => {
        if (badge.type === 'workouts' && !badge.earnedAt && newTotal >= badge.requirement) {
          return { ...badge, earnedAt: new Date().toISOString() };
        }
        return badge;
      });

      // Update daily challenge if applicable
      const updatedChallenges = prev.dailyChallenges.map(ch => {
        if (ch.type === 'workout' && ch.date === new Date().toISOString().split('T')[0]) {
          const newCurrent = ch.current + 1;
          return { ...ch, current: newCurrent, completed: newCurrent >= ch.target };
        }
        return ch;
      });

      return {
        ...prev,
        totalWorkoutsCompleted: newTotal,
        badges: updatedBadges,
        dailyChallenges: updatedChallenges,
      };
    });
    updateStreak();
  };

  const logRecipe = () => {
    setData(prev => {
      const newTotal = prev.totalRecipesMade + 1;
      const updatedBadges = prev.badges.map(badge => {
        if (badge.type === 'recipes' && !badge.earnedAt && newTotal >= badge.requirement) {
          return { ...badge, earnedAt: new Date().toISOString() };
        }
        return badge;
      });

      const updatedChallenges = prev.dailyChallenges.map(ch => {
        if (ch.type === 'recipe' && ch.date === new Date().toISOString().split('T')[0]) {
          const newCurrent = ch.current + 1;
          return { ...ch, current: newCurrent, completed: newCurrent >= ch.target };
        }
        return ch;
      });

      return {
        ...prev,
        totalRecipesMade: newTotal,
        badges: updatedBadges,
        dailyChallenges: updatedChallenges,
      };
    });
  };

  const addWeeklyProgress = (workouts: number, calories: number) => {
    const today = new Date().toISOString().split('T')[0];
    setData(prev => {
      const existing = prev.weeklyProgress.find(p => p.date === today);
      if (existing) {
        return {
          ...prev,
          weeklyProgress: prev.weeklyProgress.map(p =>
            p.date === today ? { ...p, workouts: p.workouts + workouts, calories } : p
          ),
        };
      }
      return {
        ...prev,
        weeklyProgress: [...prev.weeklyProgress.slice(-6), { date: today, workouts, calories }],
      };
    });
  };

  const refreshDailyChallenge = () => {
    const today = new Date().toISOString().split('T')[0];
    setData(prev => {
      const todaysChallenge = prev.dailyChallenges.find(c => c.date === today);
      if (!todaysChallenge) {
        return {
          ...prev,
          dailyChallenges: [generateDailyChallenge()],
        };
      }
      return prev;
    });
  };

  const earnedBadges = data.badges.filter(b => b.earnedAt);
  const unearnedBadges = data.badges.filter(b => !b.earnedAt);

  return {
    ...data,
    earnedBadges,
    unearnedBadges,
    logWorkout,
    logRecipe,
    updateStreak,
    addWeeklyProgress,
    refreshDailyChallenge,
  };
}
