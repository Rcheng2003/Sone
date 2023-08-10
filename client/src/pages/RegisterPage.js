import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import * as IoIcons from "react-icons/io5";

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function registerUser(event) {
    event.preventDefault();

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
    }
  }

  return (
    <div>
      <div className="Background">
      <div className="BackgroundRshadow"> shadow </div>
        <div className="Register">
      <h1>Register</h1>
      <form onSubmit={registerUser}>
        <input className="InputR"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Name"
        />
        <br />
        <input className="InputR"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
        />
        <br />
        <input className="InputR"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <br />
        <input className="buttR" type="submit" value="Register" />
      </form>
      </div>
    <div className="RPWelcomeShadow">
      shadow
    </div>

    <div className="RPWelcome">
     <p><span>Hi, <IoIcons.IoHappy></IoIcons.IoHappy> </span> 
      <span>Welcome to Sone! </span> 
      </p>
    </div>
    </div>
    
    </div>

  );
}

export default RegisterPage;
