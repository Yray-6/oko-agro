'use client'
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AnimatedLoading from '@/app/Loading';
import mailVerify from "@/app/assets/images/email-verified.png";
import Image from 'next/image';
import Modal from '../Modal';
import { useAuthStore } from '@/app/store/useAuthStore';

const VerifyOtp: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  // Auth store
  const { 
    verifyOtp, 
    resendOtp, 
    registrationUserId, 
    isLoading, 
    error, 
    clearError 
  } = useAuthStore();

  // Check if we have a registration user ID, if not redirect to register
  useEffect(() => {
    if (!registrationUserId) {
      router.push('/register-farmer');
      return;
    }
  }, [registrationUserId, router]);

  // Countdown timer for resend modal
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (showResendModal && countdown === 0) {
      setShowResendModal(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, showResendModal]);

  // Clear error when component mounts or code changes
  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (verificationCode.some(digit => digit !== '')) {
      clearError();
    }
  }, [verificationCode, clearError]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow single digits
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
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
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...verificationCode];
    
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    
    setVerificationCode(newCode);
    
    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleBackToLogin = () => {
    setShowSuccessModal(false);
    router.push("/login-farmer");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const code = verificationCode.join('');
    if (code.length !== 6) {
      return; // Let form validation handle this
    }

    if (!registrationUserId) {
      return;
    }

    try {
      await verifyOtp({
        userId: registrationUserId,
        otp: code
      });
      
      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      // Error is handled by the store
      console.error('Verification failed:', error);
    }
  };

  const handleResendCode = async () => {
    if (!registrationUserId) {
      return;
    }

    try {
      await resendOtp({ userId: registrationUserId });
      
      // Show resend success modal with countdown
      setShowResendModal(true);
      setCountdown(600); // 10 minutes = 600 seconds
      
      // Clear the current code inputs
      setVerificationCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      
    } catch (error) {
      // Error is handled by the store
      console.error('Failed to resend code:', error);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const closeResendModal = () => {
    setShowResendModal(false);
    setCountdown(0);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isFormValid = verificationCode.every(digit => digit !== '');

  // Don't render if no registration user ID
  if (!registrationUserId) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white/80 rounded-lg shadow-lg max-w-md mx-auto lg:mx-0">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-mainGreen mb-2">Complete Registration Process</h1>
        <p className="text-gray-600 text-xs sm:text-sm">Enter the 6-digit verification code sent to your email address.</p>
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
              disabled={isLoading}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-xs sm:text-sm text-center bg-red-50 p-3 rounded-md border border-red-200">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Resend Code Link */}
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Didn&apos;t receive the code?{' '}
            <button 
              type="button"
              onClick={handleResendCode}
              disabled={isLoading}
              className="text-mainGreen hover:text-mainGreen/80 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Resend Code
            </button>
          </p>
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="w-full px-6 py-2.5 sm:py-3 bg-mainGreen text-white text-xs sm:text-sm font-medium rounded-md hover:bg-mainGreen/90 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? (
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
      
      {isLoading && <AnimatedLoading />}

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={closeSuccessModal}
        size="md"
        showCloseButton={false}
        className="text-center"
        closeOnOverlayClick={false}
        closeOnEscape={false}
      >
        {/* Email Icon with Checkmark */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Image src={mailVerify} alt="Email Verified" width={100} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-mainGreen mb-8">
          Email Verification Successful!
        </h2>

        {/* Message */}
        <div className="space-y-4 mb-10">
          <p className="text-black leading-relaxed">
            Please, proceed to login with your password to access your dashboard
          </p>
        </div>

        {/* Back to Login Button */}
        <button
          onClick={handleBackToLogin}
          className="w-full py-3 px-6 border border-mainGreen text-mainGreen rounded-md hover:bg-mainGreen hover:text-white transition-colors font-medium"
        >
          Back to Login
        </button>
      </Modal>

      {/* Resend Code Success Modal */}
      <Modal
        isOpen={showResendModal}
        onClose={closeResendModal}
        size="md"
        showCloseButton={true}
        className="text-center"
        closeOnOverlayClick={true}
        closeOnEscape={true}
      >
        {/* Mail Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-mainGreen/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-mainGreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-mainGreen mb-4">
          Code Sent Successfully!
        </h2>

        {/* Message */}
        <div className="space-y-4 mb-8">
          <p className="text-gray-600 leading-relaxed">
            A new verification code has been sent to your email address.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-amber-800">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="font-medium">
                Code expires in: {formatTime(countdown)}
              </span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={closeResendModal}
          className="w-full py-3 px-6 bg-mainGreen text-white rounded-md hover:bg-mainGreen/90 transition-colors font-medium"
        >
          Continue
        </button>
      </Modal>
    </div>
  );
};

export default VerifyOtp;