import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import useSEO from '@/hooks/useSEO';

import logo from '@/assets/logo.png';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/home');
    }
  }, [user, authLoading, navigate]);

  useSEO({
    title: "Login | JEElytics - AI-Powered JEE Concept Checker",
    description: "Sign in to JEElytics to access AI-powered JEE practice tests and track your progress in Physics, Chemistry, and Mathematics.",
    canonical: "https://jeelytics-concept-check-01.lovable.app/login"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        error
      } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "Successfully logged in."
        });
        navigate('/home');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/home`,
        },
      });
      if (error) {
        toast({
          title: "Google sign-in failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-safe pb-safe">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <img
            src={logo}
            alt="JEElytics logo"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg mx-auto mb-3 sm:mb-4"
            loading="eager"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-gradient-primary mb-2">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground px-4">Sign in to continue your JEE preparation journey</p>
        </div>

        {/* Login Form */}
        <Card className="card-jee mx-2 sm:mx-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-lg sm:text-xl">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input id="email" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} className="pl-10 h-12 text-base" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={formData.password} onChange={handleChange} className="pl-10 pr-10 h-12 text-base" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground touch-target">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="gradient" className="w-full h-12 text-base btn-mobile" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span>or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Button type="button" variant="secondary" className="w-full h-12 text-base btn-mobile" onClick={handleGoogleLogin} disabled={loading}>
              <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" className="mr-2">
                <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-1.6 3.6-5.5 3.6-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.4l2.6-2.6C16.6 3.2 14.5 2.3 12 2.3 6.9 2.3 2.8 6.4 2.8 11.5S6.9 20.7 12 20.7c5.6 0 9.3-3.9 9.3-9.4 0-.6-.1-1-.2-1.5H12z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/signup" className="text-primary hover:text-primary-glow font-medium touch-target inline-block py-1">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>;
}