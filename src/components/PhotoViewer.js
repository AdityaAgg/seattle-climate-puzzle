import React from 'react';

const PhotoViewer = ({ isOpen, image, onClose }) => {
  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen || !image) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
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