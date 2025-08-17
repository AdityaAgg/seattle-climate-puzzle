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
            const existingImages = data.resources.map((resource, index) => ({
              id: `cloudinary-${resource.public_id}-${index}`,
              src: `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/v${resource.version}/${resource.public_id}`,
              alt: generatePhotoName(),
              uploadedAt: new Date(resource.created_at).toISOString(),
              fileName: generatePhotoName(),
              fileSize: resource.bytes || 0,
              cloudinaryId: resource.public_id,
              cloudinaryUrl: `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/v${resource.version}/${resource.public_id}`,
              cloudinaryVersion: resource.version,
              cloudinaryFormat: resource.format,
              cloudinaryWidth: resource.width,
              cloudinaryHeight: resource.height
            }));
            
            setImages(existingImages);
            localStorage.setItem('mapleLeafGalleryImages', JSON.stringify(existingImages));
            setLoading(false);
            return;
          } else {
            // No photos found
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
            // Update existing images with generated names for consistency
            const updatedImages = parsedImages.map(image => ({
              ...image,
              alt: image.alt || generatePhotoName(),
              fileName: image.fileName || generatePhotoName()
            }));
            setImages(updatedImages);
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

  useEffect(() => {
    loadExistingPhotos();
  }, [loadExistingPhotos]);

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
      setUploadStatus('Preparing upload...');

      // Create FormData for Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('tags', 'maple-leaf'); // Add maple-leaf tag for organization

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

      setUploadStatus('Uploading your photo...');

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
      setUploadStatus('Processing complete!');

      // Wait a moment to show completion
      await new Promise(resolve => setTimeout(resolve, 500));

      // Add the image to the gallery with Cloudinary data
      const generatedName = generatePhotoName();
      const newImage = {
        id: Date.now() + Math.random(),
        src: data.secure_url, // Cloudinary's secure HTTPS URL
        alt: generatedName,
        uploadedAt: new Date().toISOString(),
        fileName: generatedName,
        fileSize: file.size,
        cloudinaryId: data.public_id,
        cloudinaryUrl: data.secure_url,
        cloudinaryVersion: data.version,
        cloudinaryFormat: data.format,
        cloudinaryWidth: data.width,
        cloudinaryHeight: data.height
      };

      setImages(prev => [...prev, newImage]);

      // Show success message
      setUploadStatus('Upload successful! Refreshing gallery...');
      
      // Wait a moment then refresh the gallery to ensure all images are loaded
      setTimeout(async () => {
        await refreshGallery();
      }, 1000);

      setUploadProgress(0);
      setUploadStatus('');
      setUploading(false);
      
      return data.secure_url;
    } catch (error) {
      setUploading(false);
      setUploadProgress(0);
      setUploadStatus(`Upload failed: ${error.message}`);
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
    // This will use cache busting to ensure fresh data
    await loadExistingPhotos();
  };

  const resetView = () => {
    if (window.resetMapleLeafView) {
      window.resetMapleLeafView();
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