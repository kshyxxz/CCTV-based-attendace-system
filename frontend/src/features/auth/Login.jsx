import "./login.css";

import { FaUser } from "react-icons/fa";

import { FaLock } from "react-icons/fa";

function Login() {
  return (
    <div className="login">
      <div className="login-card">
        <h1>Welcome</h1>

        <p>Sign in to your account</p>

        <form>
          <label>Username</label>

          <div className="input-box">
            <FaUser />

            <input type="text" placeholder="Username" />
          </div>

          <label>Password</label>

          <div className="input-box">
            <FaLock />

            <input type="password" placeholder="Password" />
          </div>

          <button>Sign In</button>
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
