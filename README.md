# Seattle Climate Puzzle

An interactive web application showcasing the Seattle Climate Puzzle project from the Seattle Design Fair 2025.

## Features

- **🍁 Maple Leaf Photo Gallery**: Interactive gallery where photos are transformed into beautiful maple leaf shapes
- **📸 Cloud Storage**: Photos uploaded to Cloudinary for secure cloud storage
- **🎨 Interactive Canvas**: Figma-like pan and zoom functionality for navigating the gallery
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **💾 Local Persistence**: Photos persist across browser sessions using localStorage

## Technology Stack

- **Frontend**: React.js with modern hooks and functional components
- **Styling**: CSS with Tailwind utility classes
- **Cloud Storage**: Cloudinary for photo uploads and management
- **State Management**: React useState and useEffect hooks
- **Photo Processing**: SVG masking for maple leaf shapes

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

- **Upload Photos**: Click the upload button to add photos to your maple leaf collection
- **Navigate Gallery**: Use mouse drag to pan and scroll to zoom
- **Reset View**: Click "Reset View" to center and reset zoom
- **Manage Photos**: Remove individual photos or clear the entire gallery

## Project Structure

- `src/components/CombinedGallery.js` - Main gallery component
- `src/components/MapleLeafCanvas.js` - Interactive canvas for photo display
- `src/components/UploadControls.js` - Photo upload and gallery controls
- `src/components/GalleryFooter.js` - Gallery footer and status display

## Contributing

This project was created for the Seattle Design Fair 2025. For questions or contributions, please contact the project team.
