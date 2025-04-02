import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import * as IoIcons from "react-icons/io5";

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleNameChange(e) {
    setName(e.target.value);
    setErrorMessage("");
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
    setErrorMessage("");
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
    setErrorMessage("");
  }

  async function registerUser(event) {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.status === "ok") {
        navigate("/login");
      } else {
        setErrorMessage(data.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.log(err);
      setErrorMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="register-container">
      <div className="register-card-container">
        <div className="register-card">
          <div className="register-form-container">
            <h1>Create Account</h1>
            <form onSubmit={registerUser} className="register-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  className="form-input"
                  value={name}
                  onChange={handleNameChange}
                  type="text"
                  placeholder="Enter your full name"
                  required
                />
              </div>

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
                  placeholder="Create a password"
                  required
                />
              </div>

              {errorMessage && <p className="error-message">{errorMessage}</p>}

              <button className="primary-button" type="submit">
                Sign Up
              </button>
            </form>
          </div>
        </div>

        <div className="welcome-card">
          <div className="welcome-content">
            <div className="welcome-icon">
              <IoIcons.IoHappy size={48} />
            </div>
            <h2>Welcome to Sone!</h2>
            <p>
              We're excited to have you join our community. Create an account to
              get started with all our amazing features.
            </p>
            <p className="have-account">Already have an account?</p>
            <button
              className="secondary-button"
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
