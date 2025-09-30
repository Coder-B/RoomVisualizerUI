import React, { useState, useEffect } from 'react';

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
}

const ProductSelection: React.FC<ProductSelectionProps> = ({ selectedCategory, selectedSubCategory, onProductSelect, sessionId, searchKeywords }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProducts([]);
    setPage(0);
  }, [selectedCategory, selectedSubCategory, searchKeywords]);

  useEffect(() => {
    if (!sessionId) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = searchKeywords ? 
          `https://visualizer-backend-358835362025.northamerica-northeast2.run.app/getProductList?store=Waltham&company=Lowes&keywords=${searchKeywords}&page=${page}` :
          `https://visualizer-backend-358835362025.northamerica-northeast2.run.app/getProductList?store=Waltham&company=Lowes&category=${selectedCategory}&page=${page}`;

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
        setProducts(prev => page === 0 ? data : [...prev, ...data]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedSubCategory, page, sessionId, searchKeywords]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;
    setPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <div className="product-selection">
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.product_id} className="product-item" onClick={() => onProductSelect(product)}>
            <img src={product.image_public_url} alt={product.description || product.product_id} className="product-image" />
            <p>{product.description || product.product_id}</p>
          </div>
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default ProductSelection;
