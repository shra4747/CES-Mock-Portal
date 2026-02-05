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
    <div style={containerStyle}>
      <header style={headerStyle}>
        <img
          src="https://brand.illinois.edu/wp-content/uploads/2024/02/Block-I-orange-white-background.png"
          alt="Illinois Logo"
          style={{ height: 60, marginRight: 20 }}
        />
        <h1 style={{ margin: 0, letterSpacing: 2, color: "#13294b" }}>CES UofI Partnerships Portal</h1>
      </header>

      {!data ? (
        <div style={loginWrapperStyle}>
          <button onClick={handleLogin} style={btnStyle}>
            Log in with U of I (Shibboleth)
          </button>
          {error && <div style={errorStyle}>{error}</div>}
        </div>
      ) : (
        <main style={mainStyle}>
          <div style={userInfoStyle}>
            <div style={avatarStyle}>
              <span style={{ fontSize: 40, color: "#fff" }}>{data.user?.charAt(0).toUpperCase() || "U"}</span>
            </div>
            <div>
              <h2 style={{ margin: "0 0 10px 0", color: "#13294b" }}>Welcome, {data.user}!</h2>
              <span style={{ color: "#666", fontStyle: "italic", fontSize: 15 }}>
                You are currently partnered with:
              </span>
            </div>
          </div>
          <section style={cardListStyle}>
            {data.orgs && data.orgs.length > 0 ? (
              data.orgs.map(org => (
                <div key={org} style={orgCardStyle}>
                  <div>
                    <h3 style={{  color: "#E84A27" }}>{org}</h3>
                    <p style={{ margin: 0, color: "#3d3d3d" }}>
                      Amazing opportunity through {org} at Illinois.
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: "#555", fontStyle: "italic" }}>No current organizational partnerships.</div>
            )}
          </section>
        </main>
      )}
    </div>
  );
}

const containerStyle = {
  minHeight: "100vh",
  background: "linear-gradient(120deg, #f0f6fb 0%, #e9ecef 100%)",
  fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, 'Liberation Sans', sans-serif",
  padding: 0,
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  background: "#fff",
  borderBottom: "2px solid #13294b",
  padding: "18px 36px",
  marginBottom: 48,
  boxShadow: "0 2px 14px 0 rgba(30,50,80,0.06)"
};

const loginWrapperStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "90px"
};

const btnStyle = {
  padding: '15px 32px',
  backgroundColor: '#E84A27',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1.2em',
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  boxShadow: "0 2px 8px rgba(30,50,80,0.05)",
  transition: "background 0.2s",
};

const errorStyle = {
  marginTop: 28,
  color: '#d9534f',
  background: '#f2dede',
  padding: '12px 18px',
  borderRadius: '5px',
  fontSize: 16,
  maxWidth: 350,
  textAlign: 'center'
};

const mainStyle = {
  maxWidth: 700,
  margin: "48px auto",
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 4px 30px 0 rgba(40,40,80,0.08)",
  padding: "44px 50px 38px 50px",
};

const userInfoStyle = {
  display: "flex",
  alignItems: "center",
  gap: 24,
  marginBottom: 26
};

const avatarStyle = {
  width: 64,
  height: 64,
  borderRadius: "50%",
  backgroundColor: "#13294b",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 1px 8px rgba(30,50,80,0.03)",
  marginRight: 8,
};

const cardListStyle = {
  marginTop: 8,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 28,
};

const orgCardStyle = {
  background: "#f5f7fa",
  borderRadius: 10,
  padding: "22px 20px",
  display: "flex",
  alignItems: "center",
  minWidth: 0,
  boxShadow: "0 1px 12px rgba(30,50,80,0.09)",
  gap: 20,
  borderLeft: "4px solid #E84A27"
};

const orgLogoStyle = {
  backgroundColor: "#dde6f0",
  color: "#13294b",
  borderRadius: "50%",
  width: 48,
  height: 48,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 28,
  fontWeight: "bold",
  marginRight: 12,
};

export default App;