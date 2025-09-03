'use client'
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AnimatedLoading from '@/app/Loading';
import Modal from '../Modal';
import mail from "@/app/assets/images/mail.png"
import Image from 'next/image';


// TypeScript interfaces
interface ResetPasswordFormValues {
  email: string;
}

const initialValues: ResetPasswordFormValues = {
  email: '',
};

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

const ResetPasswordForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Reset password submitted:', values);
      
      // Show the verification modal instead of immediately navigating
      setShowVerificationModal(true);
    } catch (error) {
      console.error('Reset password failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleProceedToVerification = () => {
    setShowVerificationModal(false);
    // Navigate to verification code page
    router.push('/reset-password/verification-code');
  };

  const closeModal = () => {
    setShowVerificationModal(false);
  };

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 bg-white/80 rounded-lg shadow-lg max-w-md mx-auto lg:mx-0">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-mainGreen mb-2">Reset Your Password</h1>
          <p className="text-gray-600 text-xs sm:text-sm">Enter your registered email address to initiate password reset.</p>
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

              {/* Reset Password Button */}
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
                    Resetting Password...
                  </span>
                ) : (
                  'Reset Password'
                )}
              </button>
              
              {/* Cancel Button */}
              <button
                type="button"
                onClick={handleCancel}
                className="w-full px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors border border-gray-200"
              >
                Cancel
              </button>
            </Form>
          )}
        </Formik>

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

      {/* Verification Code Modal */}
      <Modal
        isOpen={showVerificationModal}
        onClose={closeModal}
        size="lg"
        showCloseButton={false}
        className="text-center"
        closeOnOverlayClick={false}
        closeOnEscape={false}
      >
        {/* Email Icon with Checkmark */}
        <div className="flex justify-center  mb-6">
          <div className="relative">
            {/* Email Icon */}
           <Image src={mail} alt="Email Icon" width={100}/>

        
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-mainGreen mb-8">
          Verification Code Sent!
        </h2>

        {/* Message */}
        <div className="space-y-4 mb-10">
          <p className="text-black leading-relaxed">
            Your password reset request has been initiated and a verification has been sent to your registered email address.
          </p>
          <p className="text-black leading-relaxed">
            Kindly check you inbox/spam for 5-digit code.
          </p>
        </div>

        {/* Proceed Button */}
        <button
          onClick={handleProceedToVerification}
          className="w-full py-2 px-6 border border-mainGreen text-mainGreen rounded-md hover:bg-gray-50 transition-colors font-medium"
        >
          Proceed
        </button>
      </Modal>
    </>
  );
};

export default ResetPasswordForm;