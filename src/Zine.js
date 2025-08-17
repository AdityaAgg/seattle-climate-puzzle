import React, { useRef, useState, useEffect } from 'react';

const Zine = () => {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isScrollingLeft, setIsScrollingLeft] = useState(false);
  const [isScrollingRight, setIsScrollingRight] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const scrollIntervalRef = useRef(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Array of zine images from the public/images/zine folder
  const zinePhotos = [
    { id: 1, src: '/images/zine/zine1.jpeg', alt: 'Zine Page 1' },
    { id: 2, src: '/images/zine/zine2.jpeg', alt: 'Zine Page 2' },
    { id: 3, src: '/images/zine/zine3.jpeg', alt: 'Zine Page 3' },
    { id: 4, src: '/images/zine/zine4.jpeg', alt: 'Zine Page 4' },
    { id: 5, src: '/images/zine/zine5.jpeg', alt: 'Zine Page 5' },
    { id: 6, src: '/images/zine/zine6.jpeg', alt: 'Zine Page 6' },
    { id: 7, src: '/images/zine/zine7.jpeg', alt: 'Zine Page 7' },
    { id: 8, src: '/images/zine/zine8.jpeg', alt: 'Zine Page 8' },
    { id: 9, src: '/images/zine/zine9.jpeg', alt: 'Zine Page 9' },
    { id: 10, src: '/images/zine/zine10.jpeg', alt: 'Zine Page 10' },
    { id: 11, src: '/images/zine/zine11.jpeg', alt: 'Zine Page 11' },
    { id: 12, src: '/images/zine/zine12.jpeg', alt: 'Zine Page 12' },
    { id: 13, src: '/images/zine/zine13.jpeg', alt: 'Zine Page 13' },
    { id: 14, src: '/images/zine/zine14.jpeg', alt: 'Zine Page 14' }
  ];

  const startScrolling = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollSpeed = 50; // Increased from 15 to 50 pixels per interval
      
      scrollIntervalRef.current = setInterval(() => {
        if (direction === 'left') {
          container.scrollLeft -= scrollSpeed;
        } else {
          container.scrollLeft += scrollSpeed;
        }
      }, 16); // ~60fps
    }
  };

  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  const handleArrowMouseDown = (direction) => {
    if (direction === 'left') {
      setIsScrollingLeft(true);
    } else {
      setIsScrollingRight(true);
    }
    startScrolling(direction);
  };

  const handleArrowMouseUp = () => {
    setIsScrollingLeft(false);
    setIsScrollingRight(false);
    stopScrolling();
  };

  const handleArrowMouseLeave = () => {
    setIsScrollingLeft(false);
    setIsScrollingRight(false);
    stopScrolling();
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = 'grab';
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = 'grab';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Reduced scroll speed for better control
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };



  // Debug scroll container dimensions
  React.useEffect(() => {
    // Component mounted
  }, []);

  // Cleanup interval on unmount
  React.useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  // Inline styles
  const sectionStyle = {
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    padding: '20px 0 0 0',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    minHeight: '100vh',
    maxHeight: '100vh'
  };

  const containerStyle = {
    width: '100%',
    maxWidth: 'none',
    overflow: 'hidden',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    height: '90vh'
  };

  const scrollContainerStyle = {
    display: 'flex',
    gap: 0,
    padding: 0,
    margin: 0,
    overflowX: 'scroll',
    overflowY: 'hidden',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'thin',
    scrollBehavior: 'smooth',
    height: '80%',
    whiteSpace: 'nowrap',
    flexWrap: 'nowrap',
    background: 'transparent',
    cursor: 'grab',
    userSelect: 'none',
    width: '100%',
    maxWidth: '90vw',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  };

  const imageStyle = {
    flexShrink: 0,
    height: '100%',
    display: 'block',
    objectFit: 'contain',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    pointerEvents: 'none',
    margin: 0,
    padding: 0,
    border: 'none',
    outline: 'none',
    verticalAlign: 'top'
  };

  const arrowStyle = {
    position: 'absolute',
    top: '40%',
    transform: 'translateY(-50%)',
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    fontSize: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    zIndex: 10,
    userSelect: 'none'
  };

  const leftArrowStyle = {
    ...arrowStyle,
    left: '20px'
  };

  const rightArrowStyle = {
    ...arrowStyle,
    right: '20px'
  };

  const scrollingStyle = {
    background: 'rgba(0, 113, 227, 0.9)',
    transform: 'translateY(-50%) scale(1.2)',
    boxShadow: '0 0 20px rgba(0, 113, 227, 0.5)'
  };



  return (
    <div style={sectionStyle}>
      <div style={containerStyle}>
        {/* Left Arrow - Only show on desktop */}
        {!isMobile && (
          <button
            style={{
              ...leftArrowStyle,
              ...(isScrollingLeft ? scrollingStyle : {})
            }}
            onMouseDown={() => handleArrowMouseDown('left')}
            onMouseUp={handleArrowMouseUp}
            onMouseLeave={handleArrowMouseLeave}
            aria-label="Scroll left"
          >
            ‹
          </button>
        )}

        {/* Right Arrow - Only show on desktop */}
        {!isMobile && (
          <button
            style={{
              ...rightArrowStyle,
              ...(isScrollingRight ? scrollingStyle : {})
            }}
            onMouseDown={() => handleArrowMouseDown('right')}
            onMouseUp={handleArrowMouseUp}
            onMouseLeave={handleArrowMouseLeave}
            aria-label="Scroll right"
          >
            ›
          </button>
        )}

        <div 
          ref={scrollContainerRef}
          style={scrollContainerStyle}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {zinePhotos.map((photo) => (
            <img 
              key={photo.id}
              src={photo.src} 
              alt={photo.alt}
              style={imageStyle}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Zine; 