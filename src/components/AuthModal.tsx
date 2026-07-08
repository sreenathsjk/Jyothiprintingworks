/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Lock, Mail, User as UserIcon, Phone, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { User } from '../types';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^[0-9]{10}$/.test(phone);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      
      const userDocRef = doc(db, 'users', fbUser.uid);
      const name = fbUser.displayName || 'Google Customer';
      const email = fbUser.email || '';
      const phone = fbUser.phoneNumber || '';
      
      let loggedInUser: User = {
        id: fbUser.uid,
        name,
        email,
        phone
      };

      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          loggedInUser = {
            id: fbUser.uid,
            name: data.name || name,
            email: data.email || email,
            phone: data.phone || phone
          };
        } else {
          // Create new user profile in Firestore
          await setDoc(userDocRef, {
            id: fbUser.uid,
            name,
            email,
            phone
          });
        }
      } catch (fsErr) {
        console.warn('Could not read/write user profile to Firestore:', fsErr);
        // Standard Firestore error fallback/reporting
        try {
          handleFirestoreError(fsErr, OperationType.WRITE, `users/${fbUser.uid}`);
        } catch {}
      }

      localStorage.setItem('jyothi_logged_in_user', JSON.stringify(loggedInUser));
      setSuccess('Successfully authenticated via Google!');
      setTimeout(() => {
        onLoginSuccess(loggedInUser);
        setIsLoading(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setError(err.message || 'Failed to authenticate with Google.');
      setIsLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (isLogin) {
      // LOGIN PROCESS
      if (!formData.email || !formData.password) {
        setError('Please enter both email and password.');
        setIsLoading(false);
        return;
      }

      try {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const fbUser = userCredential.user;
        
        const userDocRef = doc(db, 'users', fbUser.uid);
        let name = fbUser.displayName || 'Jyothi Client';
        let phone = '';
        
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            name = data.name || name;
            phone = data.phone || phone;
          }
        } catch (fsErr) {
          console.warn('Failed to fetch user profile from Firestore:', fsErr);
        }
        
        const loggedInUser: User = {
          id: fbUser.uid,
          name,
          email: fbUser.email || formData.email,
          phone
        };

        localStorage.setItem('jyothi_logged_in_user', JSON.stringify(loggedInUser));
        setSuccess('Successfully logged in! Welcome back.');
        setTimeout(() => {
          onLoginSuccess(loggedInUser);
          setIsLoading(false);
          onClose();
        }, 1000);
      } catch (firebaseErr: any) {
        console.warn('Firebase Email Sign In failed, trying local fallback:', firebaseErr);
        
        // Local fallback (so offline, unconfigured, or pre-registered local users still work)
        const users = JSON.parse(localStorage.getItem('jyothi_registered_users') || '[]');
        const existingUser = users.find((u: any) => u.email.toLowerCase() === formData.email.toLowerCase());
        if (existingUser) {
          if (existingUser.password !== formData.password) {
            setError('Incorrect password. Please try again.');
            setIsLoading(false);
            return;
          }

          const loggedInUser: User = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            phone: existingUser.phone
          };

          localStorage.setItem('jyothi_logged_in_user', JSON.stringify(loggedInUser));
          setSuccess('Successfully logged in (Offline Local Mode)! Welcome back.');
          setTimeout(() => {
            onLoginSuccess(loggedInUser);
            setIsLoading(false);
            onClose();
          }, 1000);
        } else {
          if (firebaseErr.code === 'auth/wrong-password' || firebaseErr.code === 'auth/invalid-credential') {
            setError('Incorrect password. Please try again.');
          } else if (firebaseErr.code === 'auth/user-not-found') {
            setError('No account found with this email. Please sign up!');
          } else {
            setError(firebaseErr.message || 'Failed to authenticate.');
          }
          setIsLoading(false);
        }
      }
    } else {
      // REGISTRATION PROCESS
      if (!formData.name || !formData.email || !formData.phone || !formData.password) {
        setError('Please fill in all required fields.');
        setIsLoading(false);
        return;
      }

      if (formData.name.trim().length < 2) {
        setError('Please enter a valid name (at least 2 characters).');
        setIsLoading(false);
        return;
      }

      if (!validateEmail(formData.email)) {
        setError('Please enter a valid email address.');
        setIsLoading(false);
        return;
      }

      if (!validatePhone(formData.phone)) {
        setError('Please enter a valid 10-digit Indian phone number.');
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        setIsLoading(false);
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const fbUser = userCredential.user;

        // Save profile in Firestore users collection
        const userDocRef = doc(db, 'users', fbUser.uid);
        await setDoc(userDocRef, {
          id: fbUser.uid,
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          phone: formData.phone.trim()
        });

        const loggedInUser: User = {
          id: fbUser.uid,
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          phone: formData.phone.trim()
        };

        localStorage.setItem('jyothi_logged_in_user', JSON.stringify(loggedInUser));
        setSuccess('Account created successfully! Logging you in...');
        
        setTimeout(() => {
          onLoginSuccess(loggedInUser);
          setIsLoading(false);
          onClose();
        }, 1200);
      } catch (firebaseErr: any) {
        console.warn('Firebase Sign Up failed, trying local fallback:', firebaseErr);
        
        // Local fallback
        const users = JSON.parse(localStorage.getItem('jyothi_registered_users') || '[]');
        const emailExists = users.some((u: any) => u.email.toLowerCase() === formData.email.toLowerCase());
        if (emailExists) {
          setError('This email is already registered. Please Sign In instead.');
          setIsLoading(false);
          return;
        }

        const newUser = {
          id: `usr-${Date.now()}`,
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          phone: formData.phone.trim(),
          password: formData.password
        };

        users.push(newUser);
        localStorage.setItem('jyothi_registered_users', JSON.stringify(users));

        const loggedInUser: User = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone
        };

        localStorage.setItem('jyothi_logged_in_user', JSON.stringify(loggedInUser));
        setSuccess('Account created successfully (Offline Local Mode)! Logging you in...');
        
        setTimeout(() => {
          onLoginSuccess(loggedInUser);
          setIsLoading(false);
          onClose();
        }, 1200);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto">
      {/* Backdrop Closer */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 z-10 overflow-hidden"
      >
        {/* Accent Banner */}
        <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-all cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium mt-1">
              {isLogin ? 'Sign in to place orders and track customization setup' : 'Join Jyothi Print Studio for premium print customizations'}
            </p>
          </div>

          {/* Tab Selection */}
          <div className="flex bg-neutral-100 dark:bg-neutral-950 p-1.5 rounded-2xl mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isLogin
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm font-extrabold'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !isLogin
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm font-extrabold'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2.5 border border-red-200/50 dark:border-red-950/45 text-left"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2.5 border border-emerald-200/50 dark:border-emerald-950/45 text-left"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}

          {/* GOOGLE SOCIAL SIGN-IN */}
          <div className="space-y-4 mb-5">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-200 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-98"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
              <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">or continue with email</span>
              <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
            {/* NAME FIELD (Sign Up Only) */}
            {!isLogin && (
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  Your Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    name="name"
                    required={!isLogin}
                    placeholder="e.g. Jyothi Sharma"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 text-xs font-semibold bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:border-orange-500 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* EMAIL FIELD */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 text-xs font-semibold bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:border-orange-500 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none dark:text-white"
                />
              </div>
            </div>

            {/* PHONE FIELD (Sign Up Only) */}
            {!isLogin && (
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  10-Digit Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="tel"
                    name="phone"
                    required={!isLogin}
                    placeholder="9494434750"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData(prev => ({ ...prev, phone: val }));
                    }}
                    className="w-full pl-10 pr-4 py-3 text-xs font-semibold bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:border-orange-500 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* PASSWORD FIELD */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 text-xs font-semibold bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:border-orange-500 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none dark:text-white"
                />
              </div>
            </div>

            {/* CONFIRM PASSWORD (Sign Up Only) */}
            {!isLogin && (
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required={!isLogin}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 text-xs font-semibold bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:border-orange-500 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 w-full py-3.5 mt-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-widest cursor-pointer disabled:opacity-50 transition-all shadow-md shadow-orange-500/15 hover:shadow-orange-500/30 active:scale-98"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Help Note */}
          <div className="mt-5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-dashed border-neutral-200 dark:border-neutral-800 text-center">
            <p className="text-[9px] font-semibold text-neutral-400 dark:text-neutral-500 leading-normal">
              💡 Prototype Demo Account: You can sign up with any new details, or type any email & password to test sign-up auto-login!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
