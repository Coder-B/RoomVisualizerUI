import React, { useState, useEffect, useCallback } from 'react';

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
  onProductsLoaded: (products: Product[]) => void;
  storeId: string | null;
}

const ProductSelection: React.FC<ProductSelectionProps> = ({ selectedCategory, selectedSubCategory, onProductSelect, sessionId, searchKeywords, onProductsLoaded, storeId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
  }, [selectedCategory, selectedSubCategory, searchKeywords]);

  useEffect(() => {
    if (!sessionId || !storeId) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = searchKeywords ? 
          `https://visualizer-backend-358835362025.northamerica-northeast2.run.app/getProductList?storeId=${storeId}&keywords=${searchKeywords}&page=${page}` :
          `https://visualizer-backend-358835362025.northamerica-northeast2.run.app/getProductList?storeId=${storeId}&category=${selectedCategory}&page=${page}`;

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
          setProducts(prev => page === 0 ? data : [...prev, ...data]);
          onProductsLoaded(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedSubCategory, page, sessionId, searchKeywords, onProductsLoaded, storeId]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading || !hasMore) return;
    setPage(prevPage => prevPage + 1);
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleProductSelect = (product: Product) => {
    onProductSelect(product);
    setSelectedProductId(product.product_id);
  };

  return (
    <div className="product-selection">
      <div className="product-grid">
        {products.map((product) => (
          <div 
            key={product.product_id} 
            className={`product-item ${selectedProductId === product.product_id ? 'selected' : ''}`}
            onClick={() => handleProductSelect(product)}
          >
            <img src={product.image_public_url} alt={product.description || product.product_id} className="product-image" />
            <p>{product.description || product.product_id}</p>
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
