import React from "react";
import ReactDOM from "react-dom/client";
import "./CSS/index.css";
import App from "./routes/App";
import Users from "./routes/Users";
import Admin from "./routes/Admin";
import UserDetail from "./routes/UserDetail";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@picocss/pico";
import { Toaster } from "react-hot-toast";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/request",
    element: <Users />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/admin/user/:userId",
    element: <UserDetail />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div className="main-container">
      <RouterProvider router={router} />
    </div>
    <Toaster />
  </React.StrictMode>
);
