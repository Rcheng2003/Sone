import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function loginUser(event) {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        navigate('/');
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <div className="Login">
        <div className="LoginShadow"></div>
        <div className="Loginn">
      <h1>Login</h1>
      <form onSubmit={loginUser}>
        <input className="InputL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
        />
        <br />
        <input className="InputL"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <br />
        <input className="buttL" type="submit" value="Login" />
      </form>
      <button className="buttL" onClick={() => navigate("/register")}>Sign up</button>
    </div>

    <div className="WelcomeLShadow">
      shadow
    </div>

    <div className="WelcomeL">
      Welcome back!
    </div>


    </div>
    </div>
  );
}

export default LoginPage;