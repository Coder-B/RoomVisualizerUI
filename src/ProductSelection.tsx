import React, { useState, useEffect, useCallback } from 'react';

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ConstructionIcon = () => (
  <img src={process.env.PUBLIC_URL + '/constructor.gif'} alt="Generating..." width="80" height="80" />
);

const DoneIcon = () => (
  <img src={process.env.PUBLIC_URL + '/eye.svg'} alt="Completed" width="24" height="24" />
);

interface Product {
  product_id: string;
  size: string;
  image_public_url: string;
  image_gs_url: string;
  description: string | null;
}

interface ProductSelectionProps {
  selectedCategory: string;
  selectedSubCategory: string;
  onProductSelect: (product: Product) => void;
  sessionId: string | null;
  searchKeywords: string;
  storeId: string | null;
  onGenerate: (selectedProduct: Product) => void;
  customerImageGSUrl: string | null;
  generatingProducts: string[];
  setGeneratingProducts: (value: React.SetStateAction<string[]>) => void;
  completedProducts: string[];
  setCompletedProducts: (value: React.SetStateAction<string[]>) => void;
}

const ProductSelection: React.FC<ProductSelectionProps> = ({ selectedCategory, selectedSubCategory, onProductSelect, sessionId, searchKeywords, storeId, onGenerate, customerImageGSUrl, generatingProducts, setGeneratingProducts, completedProducts, setCompletedProducts }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    setProducts([]);
    setHasMore(true);
  }, [selectedCategory, selectedSubCategory, searchKeywords]);

  useEffect(() => {
    if (!sessionId || !storeId) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `https://visualizer-backend-358835362025.northamerica-northeast2.run.app/getProductList?storeId=${storeId}`;
        if (searchKeywords) {
          url += `&keywords=${searchKeywords}`;
        } else {
          url += `&category=${selectedCategory}`;
          if (selectedSubCategory) {
            url += `&subcategory=${selectedSubCategory}`;
          }
        }

        const response = await fetch(url,
          {
            headers: {
              'sessionId': sessionId
            }
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setProducts(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedSubCategory, sessionId, searchKeywords, storeId]);

  useEffect(() => {
    if (generatingProducts.length === 0) return;

    const interval = setInterval(async () => {
      for (const productId of generatingProducts) {
        try {
          const product = products.find(p => p.product_id === productId);
          if (!product || !customerImageGSUrl) continue;

          const response = await fetch('https://visualizer-backend-358835362025.northamerica-northeast2.run.app/getGeneratedImageUrl', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'sessionId': sessionId || ''
            },
            body: JSON.stringify({
              customerImageGSUrl: customerImageGSUrl,
              productImageGSUrl: product.image_gs_url
            })
          });

          if (response.ok) {
            setGeneratingProducts(prev => prev.filter(id => id !== productId));
            setCompletedProducts(prev => [...prev, productId]);
          }
        } catch (error) {
          console.error(`Error checking status for product ${productId}:`, error);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [generatingProducts, products, customerImageGSUrl, sessionId, setCompletedProducts, setGeneratingProducts]);



  const handleProductClick = (product: Product) => {
    if (generatingProducts.includes(product.product_id) || completedProducts.includes(product.product_id)) {
      onProductSelect(product);
      setSelectedProductId(product.product_id);
      return;
    }

    onProductSelect(product);
    setSelectedProductId(product.product_id);
    setGeneratingProducts(prev => [...prev, product.product_id]);
    onGenerate(product);
  };

  const getClassNames = (product: Product) => {
    let classNames = 'product-item';
    if (selectedProductId === product.product_id) {
      classNames += ' selected';
    }
    if (generatingProducts.includes(product.product_id)) {
      classNames += ' generating';
    }
    if (completedProducts.includes(product.product_id)) {
      classNames += ' completed';
    }
    return classNames;
  };

  return (
    <div className="product-selection">
      <div className="product-grid">
        {products.map((product) => (
          <div
            key={product.product_id}
            className={getClassNames(product)}
            onClick={() => handleProductClick(product)}
          >
            <div className="product-image-container">
              <img src={product.image_public_url} alt={product.description || product.product_id} className="product-image" />
              <div className="product-icon-overlay">
                {generatingProducts.includes(product.product_id) ? <ConstructionIcon /> : (completedProducts.includes(product.product_id) ? <DoneIcon /> : <PlusIcon />)}
              </div>
            </div>
            <p className="product-description">{product.description || product.product_id}</p>
          </div>
        ))}
      </div>
      {loading && <div className="center-text"><p>Loading...</p></div>}
      {error && <div className="center-text"><p>Error: {error}</p></div>}
      {!loading && !hasMore && <div className="center-text"><p>No more products</p></div>}
    </div>
  );
};

export default ProductSelection;
