import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '../api/client';

export default function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'manager') navigate('/manager/dashboard');
      else navigate('/employee/dashboard');
    }
  }, [navigate]);

  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [registerRole, setRegisterRole] = useState('EMPLOYEE');

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    const currentEmail = email;
    const currentPassword = password;

    if (isRegistering) {
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    } else {
      if (!email || !password) {
        setError('Please fill in all fields.');
        return;
      }
    }

    setIsLoading(true);

    try {
      let response;
      if (isRegistering) {
        response = await api.post('/auth/register', { name, email, password, role: registerRole });
      } else {
        response = await api.post('/auth/login', { email: currentEmail, password: currentPassword });
      }

      const { token, userId, role } = response.data;
      
      const normalizedRole = role.toLowerCase();

      localStorage.setItem('token', token);
      localStorage.setItem('role', normalizedRole);
      localStorage.setItem('userId', userId.toString());

      if (normalizedRole === 'admin') navigate('/admin/dashboard');
      else if (normalizedRole === 'manager') navigate('/manager/dashboard');
      else navigate('/employee/dashboard');
    } catch (err: any) {
      if (err.response && err.response.data && typeof err.response.data === 'string') {
        setError(err.response.data);
      } else {
        setError('Invalid email or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-slate-950 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1e1b4b] via-slate-950 to-slate-950 opacity-80" />
      
      {/* Floating Shapes */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30" 
      />
      <motion.div 
        animate={{ y: [0, 20, 0], x: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30" 
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
          <CardHeader className="space-y-3 text-center pb-8 pt-10">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CardTitle className="text-4xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400 pb-2">
                GoalSphere AI
              </CardTitle>
            </motion.div>
            <CardDescription className="text-slate-300 font-medium">
              Intelligent Goal Setting & Performance Platform
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <AnimatePresence mode="wait">
                {isRegistering && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pb-1"
                  >
                    <div className="space-y-2">
                      <Label className="text-slate-300">Full Name</Label>
                      <Input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe" 
                        className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-violet-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Account Role</Label>
                      <select 
                        value={registerRole} 
                        onChange={(e) => setRegisterRole(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-violet-500 transition-colors"
                      >
                        <option value="EMPLOYEE" className="bg-slate-900">Employee</option>
                        <option value="MANAGER" className="bg-slate-900">Manager</option>
                        <option value="ADMIN" className="bg-slate-900">Administrator</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label className="text-slate-300">Email</Label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-violet-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Password</Label>
                  {!isRegistering && (
                    <button type="button" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="bg-slate-950/50 border-white/10 text-white pr-10 focus-visible:ring-violet-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {isRegistering && (
                  <motion.div
                    key="confirm-password-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 pt-1"
                  >
                    <Label className="text-slate-300">Confirm Password</Label>
                    <div className="relative">
                      <Input 
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="bg-slate-950/50 border-white/10 text-white pr-10 focus-visible:ring-violet-500"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {!isRegistering && (
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    className="rounded border-white/10 bg-slate-950/50 text-violet-500 focus:ring-violet-500/50 h-4 w-4"
                  />
                  <label htmlFor="remember" className="text-sm text-slate-300 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Remember me
                  </label>
                </div>
              )}

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-400 text-sm font-medium bg-red-400/10 p-3 rounded-md border border-red-400/20 overflow-hidden"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button 
                id="login-form-submit"
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-violet-500/20 transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isRegistering ? 'Creating Account...' : 'Authenticating...'}
                  </>
                ) : (
                  isRegistering ? 'Create Account' : 'Sign In'
                )}
              </Button>

              <div className="text-center text-sm text-slate-400 mt-4 pt-2">
                {isRegistering ? "Already have an account? " : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                  }}
                  className="text-violet-400 hover:text-violet-300 transition-colors font-medium"
                >
                  {isRegistering ? "Sign In" : "Create Account"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
