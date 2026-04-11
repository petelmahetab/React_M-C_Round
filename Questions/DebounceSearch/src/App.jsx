import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState([]);
  const [resultWithout, setWithoutDebounce] = useState([]); 


  useEffect(() => {
    console.log('🌐 Fetching API Without Debounce:', query);

    if (!query) return;
    
    fetch(`https://api.example.com/search?q=${query}`) 
      .then((d) => d.json())
      .then(setWithoutDebounce)
      .catch(err => console.error('Error:', err));
      
  }, [query])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!query) return;

      console.log('🌐 Fetching API with Debounce:', query);
      
      fetch(`https://api.example.com/search?q=${query}`) 
        .then((d) => d.json())
        .then(setResult)
        .catch(err => console.error('Error:', err));
        
      console.log('Execution completion!') 
    }, 1000)

    return () => {
      console.log('🧹 Cleanup: cancelled for:', query);
      clearTimeout(timer);
    };
  }, [query])

  return (
    <div style={{ padding: '20px' }}>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)} 
        placeholder='Search' 
        id='input'
        style={{ padding: '10px', width: '300px' }}
      />

      <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
        {/* WITHOUT DEBOUNCE */}
        <div style={{ color: '#dc3545' }}>
          <h2>❌ Without Debounce</h2>
          <p>API calls: Every keystroke</p>
          <ul>{resultWithout.map((itm, i) => <li key={`no-${i}`}>{itm}</li>)}</ul>
        </div>

        {/* WITH DEBOUNCE */}
        <div style={{ color: '#28a745' }}>
          <h2>✅ With Debounce (1000ms)</h2>
          <p>API calls: After you stop typing</p>
          <ul>{result.map((itm, i) => <li key={`debounce-${i}`}>{itm}</li>)}</ul>
        </div>
      </div>
    </div>
  )
}

export default App