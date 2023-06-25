import React from "react";

function LoginPage() {
  const [name, setName] = React.useState();
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();

  async function registerUser(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:1337/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: { name },
        email: { email },
        password: { password },
      }),
    });
    const data = await response.json();

    console.log(data);
  }

  return (
    <div>
      <h1>Registar</h1>
      <form onSubmit={registerUser}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          type="text"
        ></input>
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="email"
          placeholder="Email"
        ></input>
        <input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="password"
          placeholder="Password"
        ></input>
        <input type="submit" value="Register"></input>
      </form>
    </div>
  );
}

export default LoginPage;
