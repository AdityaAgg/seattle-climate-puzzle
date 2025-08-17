import React, { useRef } from 'react';

const UploadControls = ({ 
  uploading, 
  loading, 
  uploadProgress, 
  uploadStatus, 
  onImageUpload, 
  onRefreshGallery, 
  onResetView, 
  onClearGallery, 
  imagesCount 
}) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    onImageUpload(event);
  };

  return (
    <div className="text-center mb-6">
      <h3 className="text-3xl font-bold text-red-800 mb-4">🍁 The Gallery</h3>
      
      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span className="text-blue-700 font-medium">Loading...</span>
        </div>
      )}
      
      {/* Upload Progress Bar */}
      {uploading && (
        <div className="progress-container">
          <div className="progress-text">
            <span>{uploadStatus || 'Uploading...'}</span>
            <span className="ml-2">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
        </div>
      )}
      
      <div className="upload-controls">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading || loading}
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || loading}
        >
          {uploading ? '⏳ Uploading...' : '📸 Upload Photos'}
        </button>
        
        <button
          onClick={onRefreshGallery}
          disabled={uploading || loading}
        >
          🔄 Refresh
        </button>
        
        <button
          onClick={onResetView}
          disabled={uploading || loading}
        >
          🎯 Reset View
        </button>
      </div>
      
      {/* Simple Navigation Instructions */}
      <div className="nav-instructions">
        <p>🖱️ Drag to pan • 🔍 Scroll to zoom • 🎯 Reset to center</p>
      </div>
    </div>
  );
};

export default UploadControls; 