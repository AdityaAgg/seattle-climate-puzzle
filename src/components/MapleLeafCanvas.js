import React, { useRef, useEffect, useState } from 'react';

const MapleLeafCanvas = ({ 
  images, 
  loading, 
  pan, 
  zoom, 
  onPanChange, 
  onZoomChange,
  onImageClick 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const canvasRef = useRef(null);

  // Debug logging
  useEffect(() => {
    console.log('MapleLeafCanvas received images:', images);
    console.log('Images count:', images.length);
    if (images.length > 0) {
      console.log('First image data:', images[0]);
    }
  }, [images]);

  // Handle window resize for responsive positioning
  useEffect(() => {
    const handleResize = () => {
      // Force re-render to recalculate positions
      window.dispatchEvent(new Event('resize'));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pan and zoom handlers
  const handleMouseDown = (e) => {
    if (e.button === 0) { // Left mouse button only
      setIsDragging(true);
      setDragStart({
        x: e.clientX - pan.x,
        y: e.clientY - pan.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      onPanChange({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.3, Math.min(3, zoom * delta));
    
    // Zoom towards mouse position
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const zoomRatio = newZoom / zoom;
    onPanChange(prev => ({
      x: mouseX - (mouseX - prev.x) * zoomRatio,
      y: mouseY - (mouseY - prev.y) * zoomRatio
    }));
    
    onZoomChange(newZoom);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      // Single touch - start panning
      const touch = e.touches[0];
      setTouchStart({
        x: touch.clientX - pan.x,
        y: touch.clientY - pan.y
      });
    } else if (e.touches.length === 2) {
      // Two touches - start pinch to zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch1.clientX - touch2.clientX, 2) +
        Math.pow(touch1.clientY - touch2.clientY, 2)
      );
      setLastTouchDistance(distance);
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      // Single touch - panning
      const touch = e.touches[0];
      onPanChange({
        x: touch.clientX - touchStart.x,
        y: touch.clientY - touchStart.y
      });
    } else if (e.touches.length === 2) {
      // Two touches - pinch to zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch1.clientX - touch2.clientX, 2) +
        Math.pow(touch1.clientY - touch2.clientY, 2)
      );
      
      if (lastTouchDistance > 0) {
        const scale = distance / lastTouchDistance;
        const newZoom = Math.max(0.3, Math.min(3, zoom * scale));
        
        // Zoom towards center of the two touches
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;
        const rect = canvasRef.current.getBoundingClientRect();
        const canvasCenterX = centerX - rect.left;
        const canvasCenterY = centerY - rect.top;
        
        const zoomRatio = newZoom / zoom;
        onPanChange(prev => ({
          x: canvasCenterX - (canvasCenterX - prev.x) * zoomRatio,
          y: canvasCenterY - (canvasCenterY - prev.y) * zoomRatio
        }));
        
        onZoomChange(newZoom);
        setLastTouchDistance(distance);
      }
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    setLastTouchDistance(0);
  };

  const resetView = () => {
    onPanChange({ x: 0, y: 0 });
    onZoomChange(1);
  };

  // Expose resetView to parent component
  useEffect(() => {
    if (window.resetMapleLeafView) {
      window.resetMapleLeafView = resetView;
    } else {
      window.resetMapleLeafView = resetView;
    }
  }, []);

  const getOrganicPositions = (count) => {
    const positions = [];
    // Responsive canvas dimensions
    const canvasWidth = Math.min(1200, window.innerWidth * 0.9);
    const canvasHeight = Math.min(900, window.innerHeight * 0.7);
    
    if (count === 0) return positions;
    
    const leafWidth = 120;
    const leafHeight = 120;
    const minDistance = Math.max(leafWidth, leafHeight) * 1.2;
    
    // Use a deterministic seed for consistent positioning
    const seed = 42; // Fixed seed for consistent results
    
    for (let i = 0; i < count; i++) {
      let attempts = 0;
      let newPos;
      let validPosition = false;
      
      // Create a deterministic random number generator for this index
      const seedRandom = (seed, index) => {
        const x = Math.sin(seed + index) * 10000;
        return x - Math.floor(x);
      };
      
      while (!validPosition && attempts < 100) {
        if (i === 0) {
          // Center position for first leaf
          newPos = {
            x: canvasWidth / 2 + (seedRandom(seed, i) - 0.5) * 100,
            y: canvasHeight / 2 + (seedRandom(seed, i + 1000) - 0.5) * 100
          };
        } else {
          // Spiral pattern for subsequent leaves
          const layer = Math.floor(Math.sqrt(i));
          const itemsInLayer = Math.max(1, layer * 6);
          const itemIndex = i - Math.pow(Math.floor(Math.sqrt(i)), 2);
          
          const baseAngle = itemIndex * (Math.PI * 2) / itemsInLayer;
          const radius = layer * 100 + seedRandom(seed, i + 2000) * 40;
          
          // Add organic variation using deterministic randomness
          const flowOffset = Math.sin(i * 0.4) * 30;
          const clusterOffset = Math.cos(i * 0.6) * 25;
          const angleVariation = (seedRandom(seed, i + 3000) - 0.5) * 0.8;
          
          const finalAngle = baseAngle + angleVariation;
          
          newPos = {
            x: canvasWidth / 2 + Math.cos(finalAngle) * (radius + flowOffset) + clusterOffset,
            y: canvasHeight / 2 + Math.sin(finalAngle) * (radius + flowOffset) + clusterOffset
          };
        }
        
        // Ensure leaves are within bounds with padding
        const padding = minDistance / 2 + 20;
        newPos.x = Math.max(padding, Math.min(canvasWidth - padding, newPos.x));
        newPos.y = Math.max(padding, Math.min(canvasHeight - padding, newPos.y));
        
        validPosition = true;
        for (const existingPos of positions) {
          const distance = Math.sqrt(
            Math.pow(newPos.x - existingPos.x, 2) + 
            Math.pow(newPos.y - existingPos.y, 2)
          );
          
          if (distance < minDistance) {
            validPosition = false;
            break;
          }
        }
        
        attempts++;
      }
      
      if (!validPosition) {
        // Fallback to grid positioning if organic placement fails
        const gridCols = Math.floor(canvasWidth / minDistance);
        const gridRow = Math.floor(i / gridCols);
        const gridCol = i % gridCols;
        
        newPos = {
          x: gridCol * minDistance + minDistance / 2,
          y: gridRow * minDistance + minDistance / 2
        };
      }
      
      // Use deterministic randomness for rotation and scale
      positions.push({
        x: newPos.x,
        y: newPos.y,
        rotation: (seedRandom(seed, i + 4000) * 40) - 20,
        scale: 0.9 + seedRandom(seed, i + 5000) * 0.2,
        size: leafWidth,
        zIndex: i + 1
      });
    }
    
    return positions;
  };

  const positions = getOrganicPositions(images.length);

  return (
    <>
      {/* Canvas Container with Pan/Zoom */}
      <div 
        ref={canvasRef}
        className="leaf-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Canvas Background */}
        <div 
          className="canvas-background"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
          }}
        >
          {/* Maple Leaf Grid */}
          {images.map((image, index) => {
            const pos = positions[index];
            if (!pos) return null;

            const halfSize = pos.size / 2;

            return (
              <div
                key={image.id}
                className="leaf-piece group"
                style={{
                  left: `${pos.x - halfSize}px`,
                  top: `${pos.y - halfSize}px`,
                  transform: `rotate(${pos.rotation}deg) scale(${pos.scale})`,
                  transformOrigin: 'center center',
                  zIndex: pos.zIndex
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent panning when clicking leaves
                  onImageClick(image);
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  onImageClick(image);
                }}
              >
                <div className="relative w-full h-full group-hover:scale-110 transition-all duration-500">
                  
                  {/* Maple Leaf Masked Image */}
                  <div className="leaf-mask">
                    <img 
                      src={image.src}
                      alt={image.alt}
                      className="leaf-photo"
                    />
                  </div>
                  
                  {/* Actual maple leaf outline that follows the mask shape */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1 1">
                    <path d="M 0.994 0.570 L 0.931 0.517 L 1.061 0.391 C 1.064 0.386 1.064 0.379 1.000 0.375 C 0.997 0.370 0.985 0.367 0.986 0.375 L 0.849 0.375 L 0.832 0.293 C 0.831 0.288 0.827 0.283 0.822 0.281 C 0.817 0.279 0.811 0.280 0.806 0.283 L 0.662 0.386 L 0.685 0.127 C 0.686 0.121 0.683 0.116 0.679 0.112 C 0.675 0.109 0.668 0.108 0.663 0.110 L 0.593 0.138 L 0.514 0.008 C 0.508 0.000 0.492 0.000 0.486 0.008 L 0.410 0.130 L 0.340 0.110 C 0.334 0.108 0.328 0.109 0.324 0.112 C 0.320 0.116 0.317 0.121 0.318 0.127 L 0.341 0.386 L 0.197 0.283 C 0.192 0.280 0.185 0.279 0.181 0.281 C 0.176 0.283 0.172 0.288 0.171 0.293 L 0.154 0.375 L 0.017 0.375 C 0.011 0.375 0.006 0.378 0.003 0.383 C 0.000 0.388 0.000 0.394 0.003 0.399 L 0.070 0.525 L 0.006 0.570 C 0.002 0.574 0.000 0.579 0.001 0.585 C 0.002 0.591 0.005 0.596 0.011 0.598 L 0.298 0.726 L 0.268 0.846 C 0.267 0.852 0.268 0.858 0.273 0.862 C 0.277 0.866 0.284 0.868 0.289 0.866 L 0.484 0.806 L 0.484 0.984 C 0.484 0.993 0.491 1.000 0.500 1.000 C 0.509 1.000 0.516 0.993 0.516 0.984 L 0.516 0.806 L 0.711 0.866 C 0.716 0.868 0.723 0.866 0.727 0.862 C 0.732 0.858 0.733 0.852 0.732 0.846 L 0.702 0.726 L 0.989 0.598 C 0.995 0.596 0.998 0.591 0.999 0.585 C 1.000 0.579 0.998 0.574 0.994 0.570 Z" 
                      fill="none" 
                      stroke="#333" 
                      strokeWidth="0.008"/>
                  </svg>
                </div>
              </div>
            );
          })}

          {images.length === 0 && !loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-9xl mb-8 animate-pulse">🍁</div>
                <h2 className="text-red-800 text-3xl font-bold mb-4">Start Your Collection</h2>
                <p className="text-red-700 text-xl">Upload photos to transform them into maple leaves</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MapleLeafCanvas; 