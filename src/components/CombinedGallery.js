import React, { useState, useEffect, useCallback } from 'react';
import UploadControls from './UploadControls';
import MapleLeafCanvas from './MapleLeafCanvas';
import GalleryFooter from './GalleryFooter';
import PhotoViewer from './PhotoViewer';

const CombinedGallery = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [refreshing, setRefreshing] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);

  // Generate random 10-letter alphabet string for photo names
  const generatePhotoName = () => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return result;
  };

  // Cloudinary Configuration
  const CLOUDINARY_CONFIG = {
    cloudName: 'dx3qkqdkp',
    uploadPreset: 'maple_leaves_upload',
    apiUrl: 'https://api.cloudinary.com/v1_1'
  };

  // Load all existing photos from Cloudinary when component mounts
  const loadExistingPhotos = useCallback(async () => {
    try {
      setLoading(true);
      
      // Method 1: Try to fetch photos using the tag-based JSON endpoint
      try {
        // Add cache busting with timestamp to ensure fresh data
        const timestamp = Date.now();
        const response = await fetch(
          `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/list/maple-leaf.json?_t=${timestamp}`,
          {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.resources && data.resources.length > 0) {
            const serverImages = data.resources.map((resource, index) => ({
              id: `cloudinary-${resource.public_id}-${index}`,
              src: `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/v${resource.version}/${resource.public_id}`,
              alt: resource.public_id || generatePhotoName(),
              uploadedAt: new Date(resource.created_at).toISOString(),
              fileName: resource.public_id || generatePhotoName(),
              fileSize: resource.bytes || 0,
              cloudinaryId: resource.public_id,
              cloudinaryUrl: `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/v${resource.version}/${resource.public_id}`,
              cloudinaryVersion: resource.version,
              cloudinaryFormat: resource.format,
              cloudinaryWidth: resource.width,
              cloudinaryHeight: resource.height,
              isLocalUpload: false
            }));
            
            // Get local uploads that might not be on server yet
            const savedImages = localStorage.getItem('mapleLeafGalleryImages');
            let localUploads = [];
            if (savedImages) {
              try {
                const parsedImages = JSON.parse(savedImages);
                localUploads = parsedImages.filter(img => img.isLocalUpload === true);
              } catch (e) {
                // Error parsing localStorage images
              }
            }
            
            // Merge server images with local uploads, avoiding duplicates
            const serverIds = new Set(serverImages.map(img => img.cloudinaryId));
            const uniqueLocalUploads = localUploads.filter(img => !serverIds.has(img.cloudinaryId));
            
            const mergedImages = [...serverImages, ...uniqueLocalUploads];
            
            setImages(mergedImages);
            localStorage.setItem('mapleLeafGalleryImages', JSON.stringify(mergedImages));
            setLoading(false);
            return;
          } else {
            // No photos found on server, but check for local uploads
            const savedImages = localStorage.getItem('mapleLeafGalleryImages');
            if (savedImages) {
              try {
                const parsedImages = JSON.parse(savedImages);
                if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                  setImages(parsedImages);
                  setLoading(false);
                  return;
                }
              } catch (e) {
                // Error parsing localStorage images
              }
            }
          }
        } else {
          // API returned error
        }
      } catch (apiError) {
        // API fetch failed
      }
      
      // Method 2: Try to load from localStorage as fallback
      const savedImages = localStorage.getItem('mapleLeafGalleryImages');
      if (savedImages) {
        try {
          const parsedImages = JSON.parse(savedImages);
          if (Array.isArray(parsedImages) && parsedImages.length > 0) {
            setImages(parsedImages);
            setLoading(false);
            return;
          }
        } catch (e) {
          // Error parsing localStorage images
        }
      }
      
      setImages([]);
    } catch (error) {
      // Error initializing gallery
    } finally {
      setLoading(false);
    }
  }, [CLOUDINARY_CONFIG.cloudName]);

  // Define resetView function before useEffect hooks that use it
  const resetView = useCallback(() => {
    if (images.length === 0) {
      // No images to fit, just reset to center
      setPan({ x: 0, y: 0 });
      setZoom(1);
      return;
    }

    // Calculate canvas dimensions (same logic as MapleLeafCanvas)
    const canvasWidth = Math.min(1200, window.innerWidth * 0.9);
    const canvasHeight = Math.min(900, window.innerHeight * 0.7);
    
    // Find the bounding box of all leaves with proper margins
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    images.forEach((image, index) => {
      // Use the same positioning logic as MapleLeafCanvas
      const seed = 42; // Same seed for consistent positioning
      const seedRandom = (seed, n) => {
        const x = Math.sin(n) * 10000;
        return x - Math.floor(x);
      };
      
      // Calculate position (simplified version of the positioning logic)
      const radius = 150;
      const angle = (index / images.length) * 2 * Math.PI;
      const flowOffset = seedRandom(seed, index + 2000) * 100;
      const clusterOffset = seedRandom(seed, index + 3000) * 50;
      
      let x = canvasWidth / 2 + Math.cos(angle) * (radius + flowOffset) + clusterOffset;
      let y = canvasHeight / 2 + Math.sin(angle) * (radius + flowOffset) + clusterOffset;
      
      // Add leaf size with extra margin to ensure full visibility
      const leafSize = 80; // Increased leaf size estimate for better margins
      minX = Math.min(minX, x - leafSize);
      maxX = Math.max(maxX, x + leafSize);
      minY = Math.min(minY, y - leafSize);
      maxY = Math.max(maxY, y + leafSize);
    });
    
    // Calculate the required zoom to fit all leaves with generous margins
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    const margin = Math.max(120, Math.min(canvasWidth, canvasHeight) * 0.15); // Increased margin for better spacing
    
    const zoomX = (canvasWidth - margin * 2) / contentWidth;
    const zoomY = (canvasHeight - margin * 2) / contentHeight;
    const newZoom = Math.min(zoomX, zoomY, 1); // Don't zoom in more than 1x
    
    // Zoom out a bit more for better context and visibility
    const zoomOutFactor = 0.8; // Zoom out by 20% for better framing
    const adjustedZoom = newZoom * zoomOutFactor;
    
    // Ensure we don't zoom out too much - maintain reasonable visibility
    const minZoom = 0.2;
    const finalZoom = Math.max(adjustedZoom, minZoom);
    
    // Calculate center position
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    
    // Calculate pan to center the content
    // Use the actual canvas center, not accounting for zoom since we want the leaves centered in the visible area
    const newPanX = canvasWidth / 2 - centerX;
    const newPanY = canvasHeight / 2 - centerY;
    
    // Apply the new view
    setZoom(finalZoom);
    setPan({ x: newPanX, y: newPanY });
  }, [images, setPan, setZoom]);

  useEffect(() => {
    loadExistingPhotos();
  }, [loadExistingPhotos]);

  // Auto-reset view when images are loaded to ensure all leaves are visible
  useEffect(() => {
    if (images.length > 0 && !loading) {
      // Longer delay to ensure canvas is fully rendered and positioned
      const timer = setTimeout(() => {
        resetView();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [images, loading, resetView]);

  // Set initial centered view when component mounts
  useEffect(() => {
    // Start with a centered, slightly zoomed-out view for better context
    setPan({ x: 0, y: 0 });
    setZoom(0.8);
  }, []);

  // Handle window resize to maintain proper view
  useEffect(() => {
    const handleResize = () => {
      if (images.length > 0) {
        // Reset view after resize to ensure all leaves remain visible
        setTimeout(() => {
          resetView();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [images, resetView]);

  // Save images to localStorage whenever images change
  useEffect(() => {
    if (images.length > 0) {
      localStorage.setItem('mapleLeafGalleryImages', JSON.stringify(images));
    }
  }, [images]);

  const uploadToCloudinary = async (file) => {
    try {
      setUploading(true);
      setUploadProgress(0);
      // Preserve original filename by removing extension
      const originalName = file.name.replace(/\.[^/.]+$/, ''); // Remove file extension

      // Create FormData for Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('tags', 'maple-leaf'); // Add maple-leaf tag for organization
      
      // Preserve original filename by setting public_id
      formData.append('public_id', originalName);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      setUploadStatus('Uploading...');

      // Upload to Cloudinary
      const uploadUrl = `${CLOUDINARY_CONFIG.apiUrl}/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Clear progress interval and set to 100%
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Wait a moment to show completion
      await new Promise(resolve => setTimeout(resolve, 500));

      // Add the image to the gallery with Cloudinary data
      const newImage = {
        id: Date.now() + Math.random(),
        src: data.secure_url, // Cloudinary's secure HTTPS URL
        alt: originalName,
        uploadedAt: new Date().toISOString(),
        fileName: originalName,
        fileSize: file.size,
        cloudinaryId: data.public_id,
        cloudinaryUrl: data.secure_url,
        cloudinaryVersion: data.version,
        cloudinaryFormat: data.format,
        cloudinaryWidth: data.width,
        cloudinaryHeight: data.height,
        isLocalUpload: true // Mark as locally uploaded
      };

      // Add to local state and localStorage immediately
      setImages(prev => [...prev, newImage]);
      
      // Store in localStorage for immediate access
      const currentImages = JSON.parse(localStorage.getItem('mapleLeafGalleryImages') || '[]');
      currentImages.push(newImage);
      localStorage.setItem('mapleLeafGalleryImages', JSON.stringify(currentImages));

      // Refresh gallery after a delay to sync with server (but don't wait for it)
      setTimeout(async () => {
        try {
          await refreshGallery();
        } catch (error) {
          // Server refresh failed, but local image is displayed
        }
      }, 2000);

      setUploadProgress(0);
      setUploadStatus('');
      setUploading(false);
      
      return data.secure_url;
    } catch (error) {
      setUploading(false);
      setUploadProgress(0);
      setUploadStatus('Upload failed');
      throw error;
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Validate file type and size
        if (!file.type.startsWith('image/')) {
          alert('Please select only image files.');
          continue;
        }
        
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          alert('File size must be less than 10MB.');
          continue;
        }

        await uploadToCloudinary(file);
      } catch (error) {
        alert(`Failed to upload ${file.name}: ${error.message}`);
      }
    }
    
    // Clear the input
    event.target.value = '';
  };

  const refreshGallery = async () => {
    try {
      // Fetch fresh data from server
      const timestamp = Date.now();
      const response = await fetch(
        `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/list/maple-leaf.json?_t=${timestamp}`,
        {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.resources && data.resources.length > 0) {
          const serverImages = data.resources.map((resource, index) => ({
            id: `cloudinary-${resource.public_id}-${index}`,
            src: `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/v${resource.version}/${resource.public_id}`,
            alt: resource.public_id || generatePhotoName(),
            uploadedAt: new Date(resource.created_at).toISOString(),
            fileName: resource.public_id || generatePhotoName(),
            fileSize: resource.bytes || 0,
            cloudinaryId: resource.public_id,
            cloudinaryUrl: `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/v${resource.version}/${resource.public_id}`,
            cloudinaryVersion: resource.version,
            cloudinaryFormat: resource.format,
            cloudinaryWidth: resource.width,
            cloudinaryHeight: resource.height,
            isLocalUpload: false
          }));
          
          // Get local uploads that might not be on server yet
          const savedImages = localStorage.getItem('mapleLeafGalleryImages');
          let localUploads = [];
          if (savedImages) {
            try {
              const parsedImages = JSON.parse(savedImages);
              localUploads = parsedImages.filter(img => img.isLocalUpload === true);
            } catch (e) {
              // Error parsing localStorage images
            }
          }
          
          // Merge server images with local uploads, avoiding duplicates
          const serverIds = new Set(serverImages.map(img => img.cloudinaryId));
          const uniqueLocalUploads = localUploads.filter(img => !serverIds.has(img.cloudinaryId));
          
          const mergedImages = [...serverImages, ...uniqueLocalUploads];
          
          // Update images smoothly without clearing
          setImages(mergedImages);
          localStorage.setItem('mapleLeafGalleryImages', JSON.stringify(mergedImages));
        }
      }
    } catch (error) {
      // Refresh failed
    } finally {
      // Auto-reset view to fit all leaves after refresh
      setTimeout(() => {
        resetView();
      }, 100);
    }
  };

  const clearGallery = () => {
    setImages([]);
    localStorage.removeItem('mapleLeafGalleryImages');
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  const openPhotoViewer = (image) => {
    setSelectedImage(image);
    setIsPhotoViewerOpen(true);
  };

  const closePhotoViewer = () => {
    setIsPhotoViewerOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="maple-leaf-gallery">
      <div className="gallery-container">
        <svg width="0" height="0" className="absolute">
          <defs>
            <clipPath id="mapleLeafMask" clipPathUnits="objectBoundingBox">
              <path d="M 0.994 0.570 L 0.931 0.517 L 1.061 0.391 C 1.064 0.386 1.064 0.379 1.000 0.375 C 0.997 0.370 0.985 0.367 0.986 0.375 L 0.849 0.375 L 0.832 0.293 C 0.831 0.288 0.827 0.283 0.822 0.281 C 0.817 0.279 0.811 0.280 0.806 0.283 L 0.662 0.386 L 0.685 0.127 C 0.686 0.121 0.683 0.116 0.679 0.112 C 0.675 0.109 0.668 0.108 0.663 0.110 L 0.593 0.138 L 0.514 0.008 C 0.508 0.000 0.492 0.000 0.486 0.008 L 0.410 0.130 L 0.340 0.110 C 0.334 0.108 0.328 0.109 0.324 0.112 C 0.320 0.116 0.317 0.121 0.318 0.127 L 0.341 0.386 L 0.197 0.283 C 0.192 0.280 0.185 0.279 0.181 0.281 C 0.176 0.283 0.172 0.288 0.171 0.293 L 0.154 0.375 L 0.017 0.375 C 0.011 0.375 0.006 0.378 0.003 0.383 C 0.000 0.388 0.000 0.394 0.003 0.399 L 0.070 0.525 L 0.006 0.570 C 0.002 0.574 0.000 0.579 0.001 0.585 C 0.002 0.591 0.005 0.596 0.011 0.598 L 0.298 0.726 L 0.268 0.846 C 0.267 0.852 0.268 0.858 0.273 0.862 C 0.277 0.866 0.284 0.868 0.289 0.866 L 0.484 0.806 L 0.484 0.984 C 0.484 0.993 0.491 1.000 0.500 1.000 C 0.509 1.000 0.516 0.993 0.516 0.984 L 0.516 0.806 L 0.711 0.866 C 0.716 0.868 0.723 0.866 0.727 0.862 C 0.732 0.858 0.733 0.852 0.732 0.846 L 0.702 0.726 L 0.989 0.598 C 0.995 0.596 0.998 0.591 0.999 0.585 C 1.000 0.579 0.998 0.574 0.994 0.570 Z" />
            </clipPath>
          </defs>
        </svg>

        {/* Upload Controls Component */}
        <UploadControls
          uploading={uploading}
          loading={loading}
          refreshing={refreshing}
          uploadProgress={uploadProgress}
          uploadStatus={uploadStatus}
          onImageUpload={handleImageUpload}
          onRefreshGallery={refreshGallery}
          onResetView={resetView}
          onClearGallery={clearGallery}
          imagesCount={images.length}
        />

        {/* Maple Leaf Canvas Component */}
        <MapleLeafCanvas
          images={images}
          loading={loading}
          pan={pan}
          zoom={zoom}
          onPanChange={setPan}
          onZoomChange={setZoom}
          onImageClick={openPhotoViewer}
        />

        {/* Gallery Footer Component */}
        <GalleryFooter imagesCount={images.length} onClearGallery={clearGallery} />
      </div>
      
      {/* Photo Viewer Modal */}
      <PhotoViewer
        isOpen={isPhotoViewerOpen}
        image={selectedImage}
        onClose={closePhotoViewer}
      />
    </div>
  );
};

export default CombinedGallery; 