'use client';

import { useEffect, useState } from 'react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="mt-14 min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-amber-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 sm:top-20 sm:left-20 w-32 h-32 sm:w-72 sm:h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 right-10 sm:top-40 sm:right-20 w-32 h-32 sm:w-72 sm:h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-1/2 sm:bottom-20 w-32 h-32 sm:w-72 sm:h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-60" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className={`max-w-5xl w-full text-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Header section with title and warning icon on same line */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8 sm:mb-12">
            {/* 404 Title */}
            <div className="order-2 sm:order-1">
              <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 mb-2 sm:mb-4 animate-pulse leading-tight">
                404
              </h1>
              <div className="w-16 sm:w-24 lg:w-full h-1 sm:h-1.5 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full"></div>
            </div>

            {/* Warning Icon */}
            <div className="order-1 sm:order-2 flex-shrink-0 cursor-pointer">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-b from-red-400 to-orange-400 rounded-full p-4 sm:p-6 shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-12 h-12  text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19h-15L12 5.5zM11 16v2h2v-2h-2zm0-6v4h2v-4h-2z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Main content card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-white/20 p-6 sm:p-8 lg:p-12 mb-6 sm:mb-8 shadow-2xl">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
                🚫 Page Not Found
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-4 sm:mb-6">
                Oops! The page you&apos;re looking for seems to have vanished into thin air.
              </p>
            </div>

            {/* Status indicators */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center mb-6 sm:mb-8">
              <div className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-red-500/20 border border-red-500/30 rounded-full backdrop-blur-sm">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-red-300 font-medium text-sm sm:text-base">Error 404</span>
              </div>
              
              <div className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-orange-500/20 border border-orange-500/30 rounded-full backdrop-blur-sm">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-orange-300 font-medium text-sm sm:text-base">Missing Resource</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white mb-3 sm:mb-4">
                🔍 What Happened?
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
                The page you requested doesn&apos;t exist or has been moved. 
                Don&apos;t worry, these things happen! Let&apos;s get you back on track.
              </p>
            </div>

            {/* Help options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-orange-400 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  </svg>
                </div>
                <h4 className="text-white font-semibold text-sm sm:text-base mb-1">Check URL</h4>
                <p className="text-gray-400 text-xs sm:text-sm">Verify the web address</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-400 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h4 className="text-white font-semibold text-sm sm:text-base mb-1">Try Again</h4>
                <p className="text-gray-400 text-xs sm:text-sm">Refresh the page</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-red-400 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h4 className="text-white font-semibold text-sm sm:text-base mb-1">Go Home</h4>
                <p className="text-gray-400 text-xs sm:text-sm">Return to homepage</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center">
              <button
                onClick={() => window.history.back()}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-xl sm:rounded-2xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm sm:text-base">Go Back</span>
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white/10 text-white font-semibold rounded-xl sm:rounded-2xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30 cursor-pointer"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-sm sm:text-base">Go Home</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-400 rounded-full opacity-30 animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-orange-400 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-amber-400 rounded-full opacity-40 animate-ping"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-red-400 rounded-full opacity-60 animate-pulse"></div>
      </div>
    </div>
  );
}