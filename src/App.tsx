import React, { useState, useEffect, useCallback } from 'react';
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
  const [storeId, setStoreId] = useState<string | null>(null);
  const [generatingProducts, setGeneratingProducts] = useState<string[]>([]);
  const [completedProducts, setCompletedProducts] = useState<string[]>([]);
  const handleGenerate = useCallback((selectedProduct: any) => {
    if (!customerImageGSUrl || !sessionId || !storeId) {
      console.error('Missing required data for image generation');
      return;
    }

    const triggerImageGeneration = async () => {
      try {
        const response = await fetch(`https://visualizer-backend-358835362025.northamerica-northeast2.run.app/imageGenerationByProductId?storeId=${storeId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'sessionId': sessionId,
          },
          body: JSON.stringify({
            customerImageGsUrl: customerImageGSUrl,
            productIds: [selectedProduct.product_id],
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to trigger image generation');
        }
        // Handle successful API call if needed
        console.log('Image generation triggered for product:', selectedProduct.product_id);
      } catch (error) {
        console.error('Error triggering image generation:', error);
      }
    };

    triggerImageGeneration();
  }, [customerImageGSUrl, sessionId, storeId]);
  const [transientMessage, setTransientMessage] = useState<string | null>(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const subCategories: { [key: string]: string[] } = {
    Flooring: ['Wood', 'Carpet', 'Tile', 'Laminate'],
    Walls: ['Paint', 'Wallpaper', 'Panels'],
    Furniture: ['Sofas', 'Chairs', 'Tables', 'Beds'],
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const storeIdFromUrl = urlParams.get('storeId');
    if (storeIdFromUrl) {
      setStoreId(storeIdFromUrl);
    }
  }, []);


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
            setTransientMessage(null); // Clear any previous message
          } else if (response.status === 404) {
            setTransientMessage('Image generation is still in progress. Will be ready in seconds...');
            setTimeout(() => setTransientMessage(null), 2000); // Clear message after 2 seconds
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


  useEffect(() => {
    if (searchKeywords) {
    }
  }, [searchKeywords]);


  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setGeneratedImageUrl(null); // Reset generated image when new product is selected
  };

  const handleSearch = (keywords: string) => {
    setSearchKeywords(keywords);
    if (keywords) {
      setSelectedCategory("");
      setSelectedSubCategory("");
      setSearchVisible(true);
    }
  };

  const handleCategorySelect = () => {
    setSearchVisible(false);
  };

  return (
    <div className="App">
      <div className="sticky-top-container">
        <header className="App-header">
          <div className="header-content">
            <div className="title">DesignScape</div>
            <div className="header-actions">
              <button className="search-icon" onClick={() => setSearchVisible(!searchVisible)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
              <CategorySelection selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} selectedSubCategory={selectedSubCategory} setSelectedSubCategory={setSelectedSubCategory} onCategorySelect={handleCategorySelect} />
            </div>
          </div>
          {searchVisible && <SearchBox onSearch={handleSearch} />}
        </header>
        {selectedCategory && !searchVisible && <div className="sub-category-bar">
          {subCategories[selectedCategory].map(subCategory => (
            <button 
              key={subCategory} 
              className={selectedSubCategory === subCategory ? 'active' : ''} 
              onClick={() => setSelectedSubCategory(subCategory)}
            >
              {subCategory}
            </button>
          ))}
        </div>}
        <RoomPhotoDisplay 
          uploadedImage={uploadedImage} 
          setUploadedImage={setUploadedImage}
          selectedProduct={selectedProduct} 
          sessionId={sessionId} 
          selectedCategory={selectedCategory} 
          setCustomerImageGSUrl={setCustomerImageGSUrl}
          isGenerating={isGenerating}
          generatedImageUrl={generatedImageUrl}
          setGeneratedImageUrl={setGeneratedImageUrl}
          transientMessage={transientMessage}
        />
      </div>
      <main>
                  <ProductSelection
                    selectedCategory={selectedCategory}
                    selectedSubCategory={selectedSubCategory}
                    onProductSelect={handleProductSelect}
                    sessionId={sessionId}
                    searchKeywords={searchKeywords}
                    storeId={storeId}
                    onGenerate={handleGenerate}
                    customerImageGSUrl={customerImageGSUrl}
                    generatingProducts={generatingProducts}
                    setGeneratingProducts={setGeneratingProducts}
                    completedProducts={completedProducts}
                    setCompletedProducts={setCompletedProducts}
                  />
      </main>
    </div>
  );
}

export default App;