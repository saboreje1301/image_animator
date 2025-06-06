import React from 'react';
import { useAnimation } from '../context/AnimationContext';

function ActionButtons() {
  const { 
    sourceImage, 
    animationConfig,
    animatedVideo,
    isProcessing,
    startProcessing,
    animationStatus,
    cancelProcessing,
    downloadVideo,
    resetAll
  } = useAnimation();
  
  // Button is disabled if:
  // - No source image is uploaded
  // - Already processing
  // - No animation config is set
  const isGenerateDisabled = !sourceImage || isProcessing || !animationConfig;
  
  // Handle start processing
  const handleGenerate = async () => {
    if (isGenerateDisabled) return;
    await startProcessing();
  };
  
  // Handle download
  const handleDownload = async () => {
    if (!animatedVideo) return;
    await downloadVideo();
  };
  
  // Handle cancel
  const handleCancel = async () => {
    if (!isProcessing) return;
    await cancelProcessing();
  };
  
  // Handle reset
  const handleReset = () => {
    resetAll();
  };
  
  return (
    <section className="bg-white rounded-xl shadow-md p-6">
      <div className="flex flex-col space-y-4">
        {/* Processing button / Cancel button (when processing) */}
        {isProcessing ? (
          <button
            onClick={handleCancel}
            className="flex items-center justify-center py-3 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Cancel Processing
          </button>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={isGenerateDisabled}
            className={`flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
              isGenerateDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Generate Animation
          </button>
        )}
        
        {/* Download button (only enabled when animation is completed) */}
        <button
          onClick={handleDownload}
          disabled={!animatedVideo || animationStatus !== 'COMPLETED'}
          className={`flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 ${
            !animatedVideo || animationStatus !== 'COMPLETED'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download Animation
        </button>
        
        {/* Reset button */}
        <button
          onClick={handleReset}
          disabled={!sourceImage && !animatedVideo}
          className={`flex items-center justify-center py-2 px-4 rounded-lg border font-medium text-sm transition-colors ${
            !sourceImage && !animatedVideo
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Reset All
        </button>
      </div>
      
      {/* Usage Information */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-800 mb-2">Processing Information</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>This application uses free AI services which may have usage limitations.</span>
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Processing times may vary based on server load and selected animation options.</span>
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Generated videos are available for download for a limited time.</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default ActionButtons;