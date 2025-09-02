'use client'
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AnimatedLoading from '@/app/Loading';

const VerifyForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const handleInputChange = (index: number, value: string) => {
    // Only allow single digits
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5);
    const newCode = [...verificationCode];
    
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    
    setVerificationCode(newCode);
    
    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, 4);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const code = verificationCode.join('');
    if (code.length !== 5) {
      setError('Please enter all 5 digits');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call for verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Verification code submitted:', code);
      
      // Navigate to next step or success page
      router.push('/reset-password/verification-code/change-password');
    } catch (error) {
      console.error('Verification failed:', error);
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    // Simulate API call to resend code
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Verification code resent');
      // You could show a success message here
    } catch (error) {
      console.error('Failed to resend code:', error);
    }
  };

  const isFormValid = verificationCode.every(digit => digit !== '');

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white/80 rounded-lg shadow-lg max-w-md mx-auto lg:mx-0">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-mainGreen mb-2">Confirm Verification Code</h1>
        <p className="text-gray-600 text-xs sm:text-sm">Enter the verification code sent to your email address.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Verification Code Inputs */}
        <div className="flex justify-center gap-2 sm:gap-3">
          {verificationCode.map((digit, index) => (
            <input
              key={index}
              ref={el => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleInputChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-semibold border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-mainGreen focus:border-transparent transition-colors"
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-xs sm:text-sm text-center bg-red-50 p-2 rounded-md">{error}</div>
        )}

        {/* Resend Code Link */}
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Didn't receive the code?{' '}
            <button 
              type="button"
              onClick={handleResendCode}
              className="text-mainGreen hover:text-mainGreen/80 font-medium transition-colors"
            >
              Resend Code
            </button>
          </p>
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          className="w-full px-6 py-2.5 sm:py-3 bg-mainGreen text-white text-xs sm:text-sm font-medium rounded-md hover:bg-mainGreen/90 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Verifying...
            </span>
          ) : (
            'Verify'
          )}
        </button>
      </form>

      {/* Back to Homepage Link */}
      <div className="text-center pt-6 sm:pt-8 mt-6 sm:mt-12 border-t border-gray-200">
        <Link 
          href="/" 
          className="text-xs sm:text-sm text-mainGreen underline font-semibold hover:text-mainGreen/80 transition-colors inline-block hover:scale-105"
        >
          Back to Homepage
        </Link>
      </div>
      
      {isSubmitting && <AnimatedLoading />}
    </div>
  );
};

export default VerifyForm;