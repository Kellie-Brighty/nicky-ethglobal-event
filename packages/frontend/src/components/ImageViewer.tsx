import { useState } from "react";
import { XMarkIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

interface ImageViewerProps {
  src: string;
  alt: string;
}

export const ImageViewer = ({ src, alt }: ImageViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dalle-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className="relative mt-2">
      {isLoading && (
        <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
      )}
      
      {hasError ? (
        <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
          Failed to load image. Please try again later.
        </div>
      ) : (
        <>
          <img 
            src={src} 
            alt={alt}
            className={`
              rounded-lg max-w-full h-auto cursor-pointer
              transition-transform duration-200
              ${isZoomed ? 'fixed inset-0 z-50 m-auto max-h-screen p-4 bg-black/50 backdrop-blur-sm' : ''}
            `}
            onClick={() => setIsZoomed(!isZoomed)}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: isLoading ? 'none' : 'block' }}
          />
          
          <button
            onClick={handleDownload}
            className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
            title="Download image"
          >
            <ArrowDownTrayIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          {isZoomed && (
            <>
              <div 
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsZoomed(false)}
              />
              <button
                onClick={() => setIsZoomed(false)}
                className="fixed top-4 right-4 z-50 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}; 