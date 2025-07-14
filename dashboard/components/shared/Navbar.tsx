'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { 
  Shield, 
  Menu, 
  X, 
  Bell, 
  User,
  Home,
  Search,
  FileText,
  Wallet,
  BarChart3,
  Plus,
  Gift,
  Download,
  Settings,
  Monitor,
  Code,
  AlertTriangle,
  Users,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  role?: 'policyholder' | 'admin' | 'system-admin';
}

export function Navbar({ role }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const allLinks = {
    policyholder: [
      { href: '/policyholder', label: 'Dashboard', icon: Home },
      { href: '/policyholder/browse', label: 'Browse Policies', icon: Search },
      { href: '/policyholder/coverage', label: 'My Coverage', icon: Shield },
      { href: '/policyholder/claims', label: 'Claims', icon: FileText },
      { href: '/policyholder/wallet', label: 'Wallet', icon: Wallet },
    ],
    admin: [
      { href: '/admin', label: 'Dashboard', icon: BarChart3 },
      { href: '/admin/claims', label: 'Claims Review', icon: FileText },
      { href: '/admin/policies', label: 'Manage Policies', icon: Plus },
      { href: '/admin/offers', label: 'Seasonal Offers', icon: Gift },
      { href: '/admin/reports', label: 'Reports', icon: Download },
      { href: '/admin/settings', label: 'Settings', icon: Settings }
    ],
    'system-admin': [
      { href: '/system-admin', label: 'Monitoring', icon: Monitor },
      { href: '/system-admin/users', label: 'User Management', icon: Users },
      { href: '/system-admin/contracts', label: 'Smart Contracts', icon: Code },
    ]
  };

  const defaultLinks = [
    { href: '/solutions', label: 'Solutions', icon: undefined },
    { href: '/how-it-works', label: 'How It Works', icon: undefined },
    { href: '/benefits', label: 'Benefits', icon: undefined },
    { href: '/plans', label: 'Plans & Pricing', icon: undefined },
    { href: '/trust', label: 'Trust & Security', icon: undefined },
    { href: '/help', label: 'Help Center', icon: undefined }
  ];

  const navigationLinks = role ? allLinks[role] : defaultLinks;

  // Get the correct profile link based on role
  const getProfileLink = () => {
    switch (role) {
      case 'policyholder':
        return '/policyholder/profile';
      case 'admin':
        return '/admin/profile';
      case 'system-admin':
        return '/system-admin/profile';
      default:
        return '/profile';
    }
  };

  // Get the correct dashboard link based on role
  const getDashboardLink = () => {
    switch (role) {
      case 'policyholder':
        return '/policyholder';
      case 'admin':
        return '/admin';
      case 'system-admin':
        return '/system-admin';
      default:
        return '/dashboard';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/20 dark:border-slate-700/50">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-slate-200 hidden sm:block">BlockSecure</span>
          </Link>

          {/* Desktop Navigation - Responsive spacing */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4 2xl:space-x-6 flex-1 justify-center max-w-4xl mx-8">
            {navigationLinks.map((link, index) => (
              <Link 
                key={index}
                href={link.href}
                className="nav-item whitespace-nowrap px-2 xl:px-3 2xl:px-4"
              >
                {link.icon && <link.icon className="w-4 h-4 flex-shrink-0" />}
                <span className="hidden xl:block">{link.label}</span>
                <span className="xl:hidden text-xs">{link.label.split(' ')[0]}</span>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3 xl:space-x-4 flex-shrink-0">
            <ThemeToggle />
            
            {role && (
              <>
                <Button variant="ghost" size="sm" className="relative floating-button w-9 h-9 p-0">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  </span>
                </Button>
                
                {/* User Avatar Dropdown */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="floating-button flex items-center space-x-2 px-3"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  
                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl shadow-lg border border-white/20 dark:border-slate-700/50 py-2 z-50">
                      <Link 
                        href={getProfileLink()}
                        className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </Link>
                      <Link 
                        href={getDashboardLink()}
                        className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Home className="w-4 h-4 mr-3" />
                        Dashboard
                      </Link>
                      <hr className="my-2 border-slate-200 dark:border-slate-700" />
                      <button 
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          // Handle logout logic here
                          console.log('Logout clicked');
                        }}
                      >
                        <X className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {!role && (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-slate-600 dark:text-slate-300 hidden lg:inline-flex">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="gradient-accent text-white floating-button">
                    <span className="hidden lg:inline">Get Started</span>
                    <span className="lg:hidden">Join</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 dark:text-slate-300 w-9 h-9 p-0"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-white/20 dark:border-slate-700/50 py-4">
            <div className="flex flex-col space-y-4">
              {navigationLinks.map((link, index) => (
                <Link 
                  key={index}
                  href={link.href}
                  className="nav-item"
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  <span>{link.label}</span>
                </Link>
              ))}
              
              {role && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-white/20 dark:border-slate-700/50">
                  <Button variant="ghost" size="sm" className="relative floating-button justify-start">
                    <Bell className="w-5 h-5 mr-2" />
                    Notifications
                    <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    </span>
                  </Button>
              
                  <Link href={getProfileLink()}>
                    <Button variant="ghost" size="sm" className="floating-button w-full justify-start">
                      <User className="w-5 h-5 mr-2" />
                      Profile
                    </Button>
                  </Link>

                  <Link href={getDashboardLink()}>
                    <Button variant="ghost" size="sm" className="floating-button w-full justify-start">
                      <Home className="w-5 h-5 mr-2" />
                      Dashboard
                    </Button>
                  </Link>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="floating-button w-full justify-start text-red-600 dark:text-red-400"
                    onClick={() => {
                      setIsOpen(false);
                      // Handle logout logic here
                      console.log('Logout clicked');
                    }}
                  >
                    <X className="w-5 h-5 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
              
              {!role && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-white/20 dark:border-slate-700/50">
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="w-full gradient-accent text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
