import React, { useState, useEffect } from 'react';

const BRIDGE_URL = "http://localhost/login.php"; 
const BACKEND_URL = "http://localhost:8000"; 

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProtectedData();
  }, []);

  const handleLogin = () => {
    window.location.href = BRIDGE_URL;
  };

  const fetchProtectedData = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/orgs`, {
        method: 'GET',
        credentials: 'include', // HttpOnly cookie
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
        setError("");
      } else {
        setError("Not authenticated. Please log in.");
      }
    } catch (err) {
      setError("Backend unreachable. Is the Python server running?");
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>CES UofI Portal</h1>
      
      {!data ? (
        <button onClick={handleLogin} style={btnStyle}>Log in with U of I (Shibboleth)</button>
      ) : (
        <div>
          <h3>Welcome, {data.user}!</h3>
          <p>Your Organizations:</p>
          <ul>
            {data.orgs.map(org => <li key={org}>{org}</li>)}
          </ul>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

const btnStyle = {
  padding: '10px 20px',
  backgroundColor: '#E84A27',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
};

export default App;