import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handlePasswordChange(e) {
    setPassword(e.target.value);
    setErrorMessage("");
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
    setErrorMessage("");
  }

  async function loginUser(event) {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        navigate("/");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
      }
    } catch (err) {
      console.log(err);
      setErrorMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card-container">
        <div className="welcome-card">
          <div className="welcome-content">
            <h2>Welcome back!</h2>
            <p>We're excited to see you again. Login to access your account.</p>
            <button
              className="secondary-button"
              onClick={() => navigate("/register")}
            >
              Create Account
            </button>
          </div>
        </div>

        <div className="login-card">
          <div className="login-form-container">
            <h1>Login</h1>
            <form onSubmit={loginUser} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  className="form-input"
                  value={email}
                  onChange={handleEmailChange}
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  className="form-input"
                  value={password}
                  onChange={handlePasswordChange}
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {errorMessage && <p className="error-message">{errorMessage}</p>}

              <div className="form-footer">
                <a href="#" className="forgot-password">
                  Forgot password?
                </a>
                <button className="primary-button" type="submit">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
