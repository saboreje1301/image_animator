import React, { useEffect, useState, useRef } from 'react';
import { useAnimation } from '../context/AnimationContext';

function PreviewSection() {
  const { 
    sourceImage, 
    animatedVideo, 
    animationStatus, 
    processingProgress,
    isProcessing
  } = useAnimation();
  const [activeTab, setActiveTab] = useState('original');
  const videoRef = useRef(null);
  
  // Play the video when it becomes available
  useEffect(() => {
    if (animatedVideo?.url && videoRef.current) {
      videoRef.current.load();
      // Small delay to ensure video loads properly
      const playTimeout = setTimeout(() => {
        videoRef.current.play().catch(err => {
          console.error('Error auto-playing video:', err);
        });
      }, 300);
      
      return () => clearTimeout(playTimeout);
    }
  }, [animatedVideo?.url]);
  
  // Reset active tab when source image changes
  useEffect(() => {
    if (sourceImage && !animatedVideo) {
      setActiveTab('original');
    } else if (animatedVideo) {
      setActiveTab('animated');
    }
  }, [sourceImage, animatedVideo]);
  
  // If no image is uploaded yet, show empty state
  if (!sourceImage) {
    return (
      <section className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Preview</h2>
        <div className="flex items-center justify-center bg-gray-100 rounded-lg h-64">
          <div className="text-center p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600">Upload an image to see the preview</p>
          </div>
        </div>
      </section>
    );
  }
  
  const renderProgress = () => {
    let message = '';
    let percentage = 0;
    
    switch (animationStatus) {
      case 'PENDING':
        message = 'Preparing image...';
        percentage = 5;
        break;
      case 'PREPROCESSING':
        message = 'Preprocessing image...';
        percentage = 20;
        break;
      case 'IN_QUEUE':
        message = 'In queue...';
        percentage = 30;
        break;
      case 'PROCESSING':
        message = 'Generating animation...';
        percentage = 30 + (processingProgress * 65);
        break;
      case 'COMPLETED':
        message = 'Animation complete!';
        percentage = 100;
        break;
      case 'FAILED':
        message = 'Animation failed. Please try again.';
        percentage = 100;
        break;
      default:
        message = 'Waiting to start...';
        percentage = 0;
    }
    
    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">{message}</span>
          <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${animationStatus === 'FAILED' ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${percentage}%`, transition: 'width 0.5s ease' }}
          ></div>
        </div>
      </div>
    );
  };
  
  return (
    <section className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Preview</h2>
      
      {/* Preview Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'original' 
            ? 'text-indigo-600 border-b-2 border-indigo-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('original')}
        >
          Original Image
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'animated' 
            ? 'text-indigo-600 border-b-2 border-indigo-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('animated')}
          disabled={!animatedVideo}
        >
          Animated Result
        </button>
      </div>
      
      {/* Preview Content */}
      <div className="bg-black rounded-lg flex items-center justify-center overflow-hidden" style={{ height: '300px' }}>
        {activeTab === 'original' ? (
          <img 
            src={sourceImage?.url} 
            alt="Original" 
            className="max-w-full max-h-full object-contain"
          />
        ) : animatedVideo ? (
          <video 
            ref={videoRef}
            controls
            loop
            autoPlay
            muted
            playsInline
            className="max-w-full max-h-full"
          >
            <source src={animatedVideo.url} type={`video/${animatedVideo.format || 'mp4'}`} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="text-center text-gray-400 p-4">
            {isProcessing ? (
              <div>
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-3"></div>
                <p>Generating animation...</p>
              </div>
            ) : (
              <p>Generate an animation to see the result</p>
            )}
          </div>
        )}
      </div>
      
      {/* Progress Bar (only show when processing) */}
      {isProcessing && renderProgress()}
      
      {/* Video Info (when available) */}
      {animatedVideo && activeTab === 'animated' && (
        <div className="mt-4 text-sm text-gray-600">
          <p>
            {animatedVideo.duration}s • {animatedVideo.width}x{animatedVideo.height} • 
            {animatedVideo.quality} Quality • {animatedVideo.format.toUpperCase()}
          </p>
        </div>
      )}
    </section>
  );
}

export default PreviewSection;