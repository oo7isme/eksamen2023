import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();

    // check if email or password inputs are blank
    if (!email || !password) {
      toast.error("Email and password cannot be blank");
      return;
    }
    // send POST request to /login endpoint with form data
    axios
      .post("http://localhost:25584/login", {
        email,
        password,
      })

      .then((response) => {
        // handle response
        console.log(response);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("admin", response.data.admin);
        localStorage.setItem("ID", response.data.userId);

        if (response.data.admin) {
          nav("/admin");
        } else {
          nav("/request");
        }
      })
      .catch(() => {
        toast.error("Wrong email or password");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <br />
      <label>
        Passord:
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <br />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
