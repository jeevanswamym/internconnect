import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, GraduationCap, LogOut, LayoutDashboard, User, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLanding = location.pathname === '/';

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'student':
        return '/student-dashboard';
      case 'company':
        return '/company-dashboard';
      case 'admin':
        return '/admin-dashboard';
      default:
        return '/';
    }
  };

  const getDashboardLabel = () => {
    if (!user) return 'Login';
    switch (user.role) {
      case 'student':
        return 'Student Dashboard';
      case 'company':
        return 'Company Dashboard';
      case 'admin':
        return 'Admin Panel';
      default:
        return 'Dashboard';
    }
  };

  const getDashboardIcon = () => {
    if (!user) return <User className="w-4 h-4" />;
    switch (user.role) {
      case 'student':
        return <GraduationCap className="w-4 h-4" />;
      case 'company':
        return <LayoutDashboard className="w-4 h-4" />;
      case 'admin':
        return <Shield className="w-4 h-4" />;
      default:
        return <LayoutDashboard className="w-4 h-4" />;
    }
  };

  return (
    <nav
      className={`w-full z-50 transition-all duration-300 ${
        isLanding
          ? 'fixed top-0 left-0 bg-[#0A2B20]/90 backdrop-blur-md border-b border-[#DCE885]/10'
          : 'sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-lime flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-[#0A2B20]" />
            </div>
            <span
              className={`text-xl font-bold tracking-tight ${
                isLanding ? 'text-white' : 'text-[#0A2B20]'
              }`}
            >
              Intern<span className="text-lime">Connect</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {isLanding && (
              <>
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isLanding
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-[#0A2B20] hover:bg-gray-100'
                  }`}
                >
                  Home
                </Link>
                <a
                  href="#features"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isLanding
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-[#0A2B20] hover:bg-gray-100'
                  }`}
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isLanding
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-[#0A2B20] hover:bg-gray-100'
                  }`}
                >
                  How it Works
                </a>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2 ml-4">
                <Button
                  onClick={() => navigate(getDashboardLink())}
                  variant="ghost"
                  size="sm"
                  className={`gap-2 ${
                    isLanding
                      ? 'text-white hover:bg-white/10'
                      : 'text-[#0A2B20] hover:bg-[#0A2B20]/10'
                  }`}
                >
                  {getDashboardIcon()}
                  {getDashboardLabel()}
                </Button>
                <Button
                  onClick={logout}
                  variant="ghost"
                  size="sm"
                  className={`gap-2 ${
                    isLanding
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Button
                  onClick={() => navigate('/login')}
                  variant="ghost"
                  size="sm"
                  className={`${
                    isLanding
                      ? 'text-white hover:bg-white/10'
                      : 'text-[#0A2B20] hover:bg-[#0A2B20]/10'
                  }`}
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  size="sm"
                  className="bg-lime text-[#0A2B20] hover:bg-lime/90 font-medium"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={isLanding ? 'text-white' : 'text-[#0A2B20]'}
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-[#0A2B20] border-l border-[#DCE885]/20">
              <div className="flex flex-col gap-6 mt-8">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="w-9 h-9 rounded-lg bg-lime flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-[#0A2B20]" />
                  </div>
                  <span className="text-xl font-bold text-white">
                    Intern<span className="text-lime">Connect</span>
                  </span>
                </Link>

                <div className="flex flex-col gap-1">
                  {isLanding && (
                    <>
                      <Link
                        to="/"
                        onClick={() => setMobileOpen(false)}
                        className="px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        Home
                      </Link>
                      <a
                        href="#features"
                        onClick={() => setMobileOpen(false)}
                        className="px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        Features
                      </a>
                      <a
                        href="#how-it-works"
                        onClick={() => setMobileOpen(false)}
                        className="px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        How it Works
                      </a>
                    </>
                  )}

                  {isAuthenticated ? (
                    <>
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setMobileOpen(false)}
                        className="px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                      >
                        {getDashboardIcon()}
                        {getDashboardLabel()}
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMobileOpen(false);
                        }}
                        className="px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors flex items-center gap-2 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMobileOpen(false)}
                        className="px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileOpen(false)}
                        className="mx-4 mt-2 py-3 rounded-lg bg-lime text-[#0A2B20] font-medium text-center hover:bg-lime/90 transition-colors"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
