import React from 'react';
import imageCompression from 'browser-image-compression';

interface RoomPhotoDisplayProps {
  uploadedImage: string | null;
  selectedProduct: any | null;
  sessionId: string | null;
  selectedCategory: string;
  setUploadedImage: (url: string | null) => void;
  setCustomerImageGSUrl: (url: string | null) => void;
  setGeneratedImageUrl: (url: string | null) => void;
  isGenerating: boolean;
  generatedImageUrl: string | null;
  transientMessage: string | null;
}

const RoomPhotoDisplay: React.FC<RoomPhotoDisplayProps> = ({ 
  uploadedImage, 
  selectedProduct, 
  sessionId, 
  selectedCategory, 
  setUploadedImage, 
  setCustomerImageGSUrl,
  setGeneratedImageUrl,
  isGenerating,
  generatedImageUrl,
  transientMessage
}) => {
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const options = {
        maxSizeMB: 1.5, // 1.5Mb
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);

        const formData = new FormData();
        formData.append('file', compressedFile);
        formData.append('productCategory', selectedCategory);
        formData.append('page', '0');

        const headers: { [key: string]: string } = {};
        if (sessionId) {
          headers['sessionId'] = sessionId;
        }

        const response = await fetch('https://visualizer-backend-358835362025.northamerica-northeast2.run.app/uploadImage', {
          method: 'POST',
          headers: headers,
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setUploadedImage(data.publicUrl);
          setCustomerImageGSUrl(data.gsUrl);
        } else {
          console.error('Image upload failed');
          setUploadedImage(null);
          setCustomerImageGSUrl(null);
        }
      } catch (error) { 
        console.error('Error uploading image:', error);
        setUploadedImage(null);
        setCustomerImageGSUrl(null);
      }
    }
  };

  const handleClose = () => {
    setUploadedImage(null);
    setCustomerImageGSUrl(null);
    setGeneratedImageUrl(null);
  };

  const imageToShow = generatedImageUrl || uploadedImage;

  return (
    <div className="room-photo-display">
      {imageToShow ? (
        <div className="image-container">
          <img src={imageToShow} alt="Room" />
          {(isGenerating || transientMessage) && (
            <div className="loading-overlay">
              <p>{transientMessage || 'Generating...'}</p>
            </div>
          )}
          {uploadedImage && (
            <button className="close-button" onClick={handleClose}>X</button>
          )}
        </div>
      ) : (
        <div className="upload-prompt">
          {isGenerating ? (
            <p>Generating your new room...</p>
          ) : (
            <>
              <div className="upload-prompt-content">
                <p>Visualize your room with new products.</p>
                <label htmlFor="file-upload" className="upload-button">
                  Upload Photo
                </label>
                <input id="file-upload" type="file" onChange={handleImageUpload} accept="image/*" />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomPhotoDisplay;
