import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FaUser, FaLock } from "react-icons/fa";

function Login() {
  // 1. Define states to hold input data and error messages
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 2. Initialize the routing navigator
  const navigate = useNavigate();

  // 3. Handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Stop page reload
    setError(""); // Clear old errors

    // Simple temporary validation rule
    if (username === "admin" && password === "admin") {
      // Navigate to dashboard and erase login page from browser history back-stack
      navigate("/dashboard", { replace: true });
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login">
      <div className="login-card">
        <h1>Welcome</h1>
        <p>Sign in to your account</p>

        {/* Display validation error message if it exists */}
        {error && (
          <p style={{ color: "red", textAlign: "center", fontSize: "14px" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <div className="input-box">
            <FaUser />
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <label>Password</label>
          <div className="input-box">
            <FaLock />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Button triggers onSubmit because it is inside the <form> */}
          <button type="submit">Sign In</button>
        </form>

        <div className="footer">
          CCTV BASED AUTOMATED ATTENDANCE SYSTEM <br />
          USING FACE RECOGNITION
        </div>
      </div>
    </div>
  );
}

export default Login;
