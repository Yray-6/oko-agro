'use client'
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';

// TypeScript interfaces
interface LoginFormValues {
  email: string;
  password: string;
}

const initialValues: LoginFormValues = {
  email: '',
  password: '',
};

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const ProcessorLoginForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Login submitted:', values);
    alert('Login successful!');
    setIsSubmitting(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white/80 rounded-lg shadow-lg max-w-md mx-auto lg:mx-0">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-mainGreen mb-2">Login as Processor</h1>
        <p className="text-gray-600 text-xs sm:text-sm">Welcome back — your growth journey continues.</p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="space-y-4 sm:space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Email Address *
              </label>
              <Field
                name="email"
                type="email"
                className="w-full px-3 py-2 sm:py-3 text-xs sm:text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent transition-colors"
                placeholder="Onarubeduwaie@gmail.com"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Password *
              </label>
              <div className="relative">
                <Field
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 sm:py-3 text-xs sm:text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent pr-10 transition-colors"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                href="/reset-password" 
                className="text-xs sm:text-sm text-mainGreen hover:text-mainGreen/80 font-medium transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-2.5 sm:py-3 bg-mainGreen text-white text-xs sm:text-sm font-medium rounded-md hover:bg-mainGreen/90 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                    <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Logging In...
                </span>
              ) : (
                'Log In'
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-3 sm:pt-4">
              <p className="text-xs sm:text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link 
                  href="/register-processor" 
                  className="text-mainGreen hover:text-mainGreen/80 font-medium transition-colors"
                >
                  Create an Account
                </Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>

      {/* Back to Homepage Link */}
      <div className="text-center pt-6 sm:pt-8 mt-2 border-t border-gray-200">
        <Link 
          href="/" 
          className="text-xs sm:text-sm text-mainGreen underline font-semibold hover:text-mainGreen/80 transition-colors inline-block hover:scale-105"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default ProcessorLoginForm;