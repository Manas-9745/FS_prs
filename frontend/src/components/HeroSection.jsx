import React from 'react';

const HeroSection = ({ setCurrentPage, setShowReportModal }) => {
  return (
    <div className="bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-20">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Find What You</span>{' '}
                <span className="block text-primary xl:inline">Lost</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                The campus-wide lost and found platform. Easily report items you've found or search for things you've misplaced.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <button
                    onClick={() => setCurrentPage('dashboard')}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-hover md:py-4 md:text-lg md:px-10 transition"
                  >
                    View Lost Items
                  </button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition"
                  >
                    Report an Item
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 mt-10 lg:mt-0 opacity-10">
         {/* Decorative pattern since we don't have images */}
        <svg className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full text-primary" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polygon points="50,0 100,0 50,100 0,100" />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
