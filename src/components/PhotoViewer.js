import React, { useEffect, useCallback } from 'react';

const PhotoViewer = ({ isOpen, image, onClose }) => {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !image) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="photo-viewer-overlay"
      onClick={handleBackdropClick}
    >
      <button 
        className="photo-viewer-close"
        onClick={onClose}
        aria-label="Close photo viewer"
      >
        ×
      </button>
      
      <img 
        src={image.src} 
        alt={image.alt || 'Maple Leaf Photo'}
        className="photo-viewer-image"
      />
    </div>
  );
};

export default PhotoViewer; 