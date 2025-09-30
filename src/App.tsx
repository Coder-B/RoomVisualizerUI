import React, { useState, useEffect } from 'react';
import './App.css';
import CategorySelection from './CategorySelection';
import RoomPhotoDisplay from './RoomPhotoDisplay';
import ProductSelection from './ProductSelection';
import SearchBox from './SearchBox';

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i=0;i < ca.length;i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

const setCookie = (name: string, value: string, days: number) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState('Flooring');
  const [selectedSubCategory, setSelectedSubCategory] = useState('Wood');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [customerImageGSUrl, setCustomerImageGSUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [searchKeywords, setSearchKeywords] = useState('');


  useEffect(() => {
    let sid = getCookie('sessionId');
    if (sid) {
      setSessionId(sid);
    } else {
      sid = Date.now().toString(36) + Math.random().toString(36).substr(2);
      setSessionId(sid);
      setCookie('sessionId', sid, 7); // Store for 7 days
    }
  }, []);

  useEffect(() => {
    if (customerImageGSUrl && selectedProduct && selectedProduct.image_gs_url) {
      const getGeneratedImage = async () => {
        setIsGenerating(true);
        setGeneratedImageUrl(null);
        try {
          const response = await fetch('https://visualizer-backend-358835362025.northamerica-northeast2.run.app/getGeneratedImageUrl', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'sessionId': sessionId || ''
            },
            body: JSON.stringify({
              customerImageGSUrl: customerImageGSUrl,
              productImageGSUrl: selectedProduct.image_gs_url
            })
          });

          if (response.ok) {
            const data = await response.json();
            setGeneratedImageUrl(data.publicUrl);
          } else {
            console.error('Failed to generate image');
          }
        } catch (error) {
          console.error('Error generating image:', error);
        } finally {
          setIsGenerating(false);
        }
      };

      getGeneratedImage();
    }
  }, [customerImageGSUrl, selectedProduct, sessionId]);


  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setGeneratedImageUrl(null); // Reset generated image when new product is selected
  };

  const handleSearch = (keywords: string) => {
    setSearchKeywords(keywords);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          <div className="title">Room Visualizer</div>
        </div>
        <SearchBox onSearch={handleSearch} />
      </header>
      <main>
        <CategorySelection selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} selectedSubCategory={selectedSubCategory} setSelectedSubCategory={setSelectedSubCategory} />
        <RoomPhotoDisplay 
          uploadedImage={uploadedImage} 
          setUploadedImage={setUploadedImage} 
          selectedProduct={selectedProduct} 
          sessionId={sessionId} 
          selectedCategory={selectedCategory} 
          setCustomerImageGSUrl={setCustomerImageGSUrl}
          isGenerating={isGenerating}
          generatedImageUrl={generatedImageUrl}
        />
        <ProductSelection selectedCategory={selectedCategory} selectedSubCategory={selectedSubCategory} onProductSelect={handleProductSelect} sessionId={sessionId} searchKeywords={searchKeywords} />
      </main>
    </div>
  );
}

export default App;