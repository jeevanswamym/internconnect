import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '@/data/mockStore';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // First try mock store login (for demo accounts)
      const mockUser = loginUser(email, password);
      if (mockUser) {
        await login(email, password);
        const path =
          mockUser.role === 'student'
            ? '/student-dashboard'
            : mockUser.role === 'company'
            ? '/company-dashboard'
            : '/admin-dashboard';
        navigate(path);
        return;
      }

      // Try Supabase login
      const success = await login(email, password);
      if (success) {
        navigate('/student-dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (role: 'student' | 'company' | 'admin') => {
    const demos = {
      student: { email: 'student@demo.com', password: 'demo123' },
      company: { email: 'company@demo.com', password: 'demo123' },
      admin: { email: 'admin@demo.com', password: 'demo123' },
    };
    setEmail(demos[role].email);
    setPassword(demos[role].password);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#0A2B20] flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-[#DCE885]" />
          </div>
          <span className="text-2xl font-bold text-[#0A2B20]">
            Intern<span className="text-[#4a7c59]">Connect</span>
          </span>
        </div>

        <Card className="border-0 shadow-xl shadow-[#0A2B20]/5">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-[#0A2B20]">Welcome back</CardTitle>
            <p className="text-sm text-gray-500">Sign in to your account</p>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 border-gray-200 focus:border-[#0A2B20] focus:ring-[#0A2B20]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 border-gray-200 focus:border-[#0A2B20] focus:ring-[#0A2B20] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#0A2B20] hover:bg-[#113822] text-white font-medium"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo accounts */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center mb-3">Quick login with demo accounts</p>
              <div className="grid grid-cols-3 gap-2">
                {(['student', 'company', 'admin'] as const).map((role) => (
                  <Button
                    key={role}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fillDemo(role)}
                    className="text-xs capitalize border-gray-200 hover:bg-[#0A2B20] hover:text-white"
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>

            <p className="text-sm text-center text-gray-500 mt-6">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-[#0A2B20] font-medium hover:underline"
              >
                Sign up
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
