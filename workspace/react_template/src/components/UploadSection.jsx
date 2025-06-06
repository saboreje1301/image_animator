import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAnimation } from '../context/AnimationContext';
import useImageUpload from '../hooks/useImageUpload';

function UploadSection() {
  const { sourceImage, setSourceImage, isUploading, setIsUploading } = useAnimation();
  const { uploadImage } = useImageUpload();
  
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles?.length) {
      const file = acceptedFiles[0];
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (JPEG, PNG, WebP)');
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Please upload an image smaller than 10MB');
        return;
      }
      
      try {
        setIsUploading(true);
        const uploadedImage = await uploadImage(file);
        setSourceImage(uploadedImage);
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('Failed to upload image. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  }, [uploadImage, setSourceImage, setIsUploading]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    },
    multiple: false
  });
  
  return (
    <section className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Image</h2>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}`}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-2"></div>
            <p className="text-gray-600">Uploading image...</p>
          </div>
        ) : sourceImage ? (
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-4 overflow-hidden rounded-md">
              <img 
                src={sourceImage.url} 
                alt="Uploaded image" 
                className="object-cover w-full h-full"
              />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSourceImage(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500">{sourceImage.fileName}</p>
            <p className="text-xs text-gray-400">{`${sourceImage.width}x${sourceImage.height} • ${(sourceImage.fileSize / 1024).toFixed(1)} KB`}</p>
            <p className="mt-2 text-indigo-600 text-sm">Click or drag to replace</p>
          </div>
        ) : (
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-700 mb-1">Drag & drop your image here</p>
            <p className="text-gray-500 text-sm">or click to browse files</p>
            <p className="text-gray-400 text-xs mt-2">Supports JPG, PNG, WebP (max 10MB)</p>
          </div>
        )}
      </div>
      
      {sourceImage && (
        <div className="mt-4 bg-blue-50 rounded-lg p-3 text-sm text-blue-700 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p>
            Your image has been uploaded. Now you can adjust animation settings in the options panel 
            and click "Generate Animation" when ready.
          </p>
        </div>
      )}
    </section>
  );
}

export default UploadSection;