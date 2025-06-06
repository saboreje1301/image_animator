import React, { useEffect } from 'react';
import { useAnimation } from '../context/AnimationContext';
import useAnimationConfig from '../hooks/useAnimationConfig';

function OptionsPanel() {
  const { sourceImage, animationConfig, setAnimationConfig, compatibleServices } = useAnimation();
  const { availableStyles, qualityOptions } = useAnimationConfig();

  // Update animation config when a slider or option changes
  const handleConfigChange = (key, value) => {
    setAnimationConfig({
      ...animationConfig,
      [key]: value
    });
  };

  // Effect to reset config to default values when image changes
  useEffect(() => {
    if (sourceImage) {
      setAnimationConfig({
        styleType: 'natural', // Default style
        motionIntensity: 0.5,
        duration: 3,
        quality: 'MEDIUM',
        advancedParams: {}
      });
    }
  }, [sourceImage, setAnimationConfig]);

  // If no image is uploaded yet, show disabled state
  if (!sourceImage) {
    return (
      <section className="bg-white rounded-xl shadow-md p-6 opacity-70">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Animation Options</h2>
        <div className="text-center py-8 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <p className="text-lg">Please upload an image first</p>
          <p className="text-sm mt-2">Animation options will be available after uploading</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Animation Options</h2>
      
      {/* Animation Style Selection */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-medium mb-2">Animation Style</label>
        <div className="grid grid-cols-3 gap-3">
          {availableStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => handleConfigChange('styleType', style.id)}
              className={`text-center p-2 rounded-lg border transition-all 
                ${animationConfig.styleType === style.id 
                ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
              title={style.description}
            >
              <div className="bg-gray-100 rounded-md p-1 mb-2 h-16 flex items-center justify-center">
                <img 
                  src={style.thumbnail} 
                  alt={style.name} 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <span className="text-sm font-medium block truncate">{style.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Motion Intensity Slider */}
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <label className="block text-gray-700 text-sm font-medium">Motion Intensity</label>
          <span className="text-xs text-gray-500">{Math.round(animationConfig.motionIntensity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={animationConfig.motionIntensity}
          onChange={(e) => handleConfigChange('motionIntensity', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Subtle</span>
          <span>Dynamic</span>
        </div>
      </div>
      
      {/* Duration Slider */}
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <label className="block text-gray-700 text-sm font-medium">Duration (seconds)</label>
          <span className="text-xs text-gray-500">{animationConfig.duration}s</span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          step="0.5"
          value={animationConfig.duration}
          onChange={(e) => handleConfigChange('duration', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Shorter</span>
          <span>Longer</span>
        </div>
      </div>
      
      {/* Quality Selection */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-medium mb-2">Video Quality</label>
        <div className="grid grid-cols-3 gap-3">
          {qualityOptions.map((quality) => (
            <button
              key={quality.id}
              onClick={() => handleConfigChange('quality', quality.id)}
              className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all
                ${animationConfig.quality === quality.id 
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              disabled={quality.restricted && !compatibleServices.some(service => service.tier === 'PREMIUM')}
            >
              {quality.name}
              {quality.restricted && !compatibleServices.some(service => service.tier === 'PREMIUM') && (
                <span className="block text-xs font-normal text-gray-400 mt-1">Premium only</span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Advanced Options Toggle */}
      <div className="border-t pt-4">
        <button
          className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          onClick={() => alert('Advanced options are not available in the demo version')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Advanced Options
        </button>
      </div>
      
      {/* Service Information */}
      {compatibleServices.length > 0 && (
        <div className="mt-4 bg-gray-50 rounded-lg p-3 text-xs">
          <p className="font-medium text-gray-700 mb-1">Compatible AI Services:</p>
          <ul className="text-gray-600">
            {compatibleServices.map(service => (
              <li key={service.id} className="flex items-center mb-1">
                <span className={`w-2 h-2 rounded-full mr-1.5 ${service.status === 'AVAILABLE' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                {service.name}
                {service.status !== 'AVAILABLE' && (
                  <span className="ml-1 text-amber-500">
                    ({service.status === 'RATE_LIMITED' ? 'Rate Limited' : 'Limited Availability'})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default OptionsPanel;