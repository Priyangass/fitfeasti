import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  Sparkles, LayoutDashboard, Utensils, Dumbbell, Heart, 
  LogOut, Menu, X, TrendingUp, Brain, FileDown 
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocalStorage, SavedRecipe, SavedWorkoutPlan } from '@/hooks/useLocalStorage';
import { exportToPDF, exportToCSV } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';

export default function DashboardNav() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedRecipes] = useLocalStorage<SavedRecipe[]>('fitfeast_saved_recipes', []);
  const [savedWorkouts] = useLocalStorage<SavedWorkoutPlan[]>('fitfeast_saved_workouts', []);
  const { toast } = useToast();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/workouts', label: 'Workouts', icon: Dumbbell },
    { href: '/dashboard/recipes', label: 'Recipes', icon: Utensils },
    { href: '/dashboard/wellness', label: 'Wellness', icon: Brain },
    { href: '/dashboard/progress', label: 'Progress', icon: TrendingUp },
    { href: '/dashboard/favorites', label: 'Favorites', icon: Heart },
  ];

  const handleExportPDF = () => {
    if (savedWorkouts.length === 0 && savedRecipes.length === 0) {
      toast({
        title: 'Nothing to export',
        description: 'Save some workouts or recipes first.',
        variant: 'destructive',
      });
      return;
    }
    exportToPDF(savedWorkouts, savedRecipes);
    toast({ title: 'PDF export ready!', description: 'Print dialog opened.' });
  };

  const handleExportCSV = () => {
    if (savedWorkouts.length === 0 && savedRecipes.length === 0) {
      toast({
        title: 'Nothing to export',
        description: 'Save some workouts or recipes first.',
        variant: 'destructive',
      });
      return;
    }
    exportToCSV(savedWorkouts, savedRecipes);
    toast({ title: 'CSV exported!', description: 'File downloaded.' });
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-display font-bold hidden sm:block">FitFeast AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <Link key={link.href} to={link.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-2",
                      isActive && "bg-primary/10 text-primary"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center gap-2">
            {/* Export Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <FileDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportPDF}>
                  Export to PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportCSV}>
                  Export to CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />

            <span className="text-sm text-muted-foreground hidden sm:block">
              Hi, <span className="text-foreground font-medium">{user?.name?.split(' ')[0]}</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden pt-4 pb-2 border-t border-border mt-3 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3",
                        isActive && "bg-primary/10 text-primary"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
