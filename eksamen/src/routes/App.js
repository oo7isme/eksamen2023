import React, { useState } from "react";
import "../CSS/App.css";
import Register from "../components/register";
import Login from "../components/login";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
function App() {
  const [showLogin, setShowLogin] = useState(true);
  const nav = useNavigate();
  useEffect(() => {
    // check if token exists in local storage
    if (localStorage.getItem("token")) {
      // check if admin value is true
      if (localStorage.getItem("admin") === "true") {
        // redirect to admin page
        nav("/admin");
      } else {
        // redirect to another page
        nav("/request");
      }
    }
  }, [nav]);
  return (
    <div className="App" data-theme="light">
      {showLogin ? <Login /> : <Register />}
      <p style={{ fontSize: "15px" }} onClick={() => setShowLogin(!showLogin)}>
        {showLogin ? "Register her" : "Login her"}
      </p>
    </div>
  );
}

export default App;
