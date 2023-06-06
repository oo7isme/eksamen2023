import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fornavn, setFornavn] = useState("");
  const [etternavn, setEtternavn] = useState("");
  const [admin, setAdmin] = useState(false);
  const nav = useNavigate();

  const Login = () => {
    // send POST request to /login endpoint with form data
    axios
      .post("http://localhost:25584/login", {
        email,
        password,
      })

      .then((response) => {
        // handle response
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("admin", response.data.admin);
        localStorage.setItem("ID", response.data.userId);
        if (response.data.admin) {
          nav("/admin");
        } else {
          nav("/request");
        }
      })
      .catch((response) => {
        // handle error
        console.log(response);
      });
  };

  const clearInput = () => {
    setEmail("");
    setPassword("");
    setFornavn("");
    setEtternavn("");
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email || !password || !fornavn || !etternavn) {
      toast.error("Please fill in all the fields");
      return;
    }
    axios
      .post("http://localhost:25584/register", {
        email,
        password,
        fornavn,
        etternavn,
        admin,
      })
      .then((res) => {
        toast.success(res.data.message);
        clearInput();
        Login();
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          toast.error("User already exists. Please login.");
          clearInput();
        } else {
          toast.error(error.response.data.message);
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label>
        Passord:
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <div className="grid">
        <label>
          Fornavn:
          <input
            type="text"
            value={fornavn}
            onChange={(event) => setFornavn(event.target.value)}
          />
        </label>
        <label>
          Etternavn:
          <input
            type="text"
            value={etternavn}
            onChange={(event) => setEtternavn(event.target.value)}
          />
        </label>
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
