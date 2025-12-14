import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Candy, LogOut, Menu, X, Shield, User as UserIcon, LogIn } from 'lucide-react';
import Button from './Button';
import { UserRole } from '../types';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-brand-500 p-1.5 rounded-lg">
                <Candy className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">Sugar<span className="text-brand-600">Rush</span></span>
            </Link>
            
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/') 
                    ? 'border-brand-500 text-slate-900' 
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                Storefront
              </Link>
              {user?.role === UserRole.ADMIN && (
                <Link
                  to="/admin"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/admin') 
                      ? 'border-brand-500 text-slate-900' 
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                  }`}
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Inventory
                </Link>
              )}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <UserIcon className="w-4 h-4" />
                  <span>{user?.username}</span>
                  <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full capitalize">{user?.role}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500">
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign out
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden bg-white border-t">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/') 
                  ? 'bg-brand-50 border-brand-500 text-brand-700' 
                  : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Storefront
            </Link>
            {user?.role === UserRole.ADMIN && (
              <Link
                to="/admin"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive('/admin') 
                    ? 'bg-brand-50 border-brand-500 text-brand-700' 
                    : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Inventory Management
              </Link>
            )}
          </div>
          <div className="pt-4 pb-4 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="space-y-2 px-4">
                 <div className="flex items-center gap-2 text-base font-medium text-slate-800">
                  <UserIcon className="w-5 h-5" />
                  <span>{user?.username}</span>
                </div>
                <div className="text-sm text-slate-500 capitalize">{user?.role}</div>
                <Button variant="outline" className="w-full mt-2" onClick={handleLogout}>
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="px-4">
                 <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="primary" className="w-full">Sign In</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;