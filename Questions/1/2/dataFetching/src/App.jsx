import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setProducts(data.slice(0, 10)); 
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="app">
      <h1>🛍️  Store Products</h1>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// Separate component for product card
function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img 
        src={product.image} 
        alt={product.title}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
        }}
      />
      <div className="product-info">
        <h3>{product.title}</h3>
        <p className="category">{product.category}</p>
        <p className="price">${product.price.toFixed(2)}</p>
        <p className="rating">
          ⭐ {product.rating.rate} ({product.rating.count} reviews)
        </p>
        <p className="description">{product.description.slice(0, 100)}...</p>
      </div>
    </div>
  );
}

export default App;