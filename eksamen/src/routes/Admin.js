import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../CSS/Admin.css";

const Admin = () => {
  const nav = useNavigate();
  const [userList, setUserList] = useState([]);
  const [adminList, setAdminList] = useState([]);

  const handleLogout = () => {
    // remove token and admin status from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.removeItem("ID");

    // redirect to login page
    nav("/");
  };

  const handleDeleteUser = (userId) => {
    // send a DELETE request to the backend to delete the user
    axios
      .delete(`http://localhost:25584/users/${userId}`)
      .then((response) => {
        toast.success("User deleted successfully");
        // update the userList state by filtering out the deleted user
        setUserList(userList.filter((user) => user._id !== userId));
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        toast.error("Error deleting user");
      });
  };
  useEffect(() => {
    // check if token exists
    if (
      !localStorage.getItem("token") ||
      localStorage.getItem("admin") !== "true"
    ) {
      nav("/");
    }
  }, [nav]);

  useEffect(() => {
    // retrieve user list from the backend
    axios
      .get("http://localhost:25584/users")
      .then((response) => {
        // handle the response
        setUserList(response.data);
      })
      .catch((error) => {
        // handle the error
      });

    axios
      .get("http://localhost:25584/admins")
      .then((response) => {
        // handle the response
        setAdminList(response.data);
      })
      .catch((error) => {
        // handle the error
      });
  }, []);

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    fornavn: "",
    etternavn: "",
    adresse: "",
    postnummer: "",
    poststed: "",
    batplass: "",
    status: "",
    admin: false,
  });

  const handleNewUserChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setNewUser({
      ...newUser,
      [e.target.name]: value,
    });
  };

  const handleRegisterUser = () => {
    // send a POST request to the backend to register a new user
    axios
      .post("http://localhost:25584/registerUser", newUser)
      .then((response) => {
        toast.success("User registered successfully");
        // clear the form fields after successful registration
        setNewUser({
          email: "",
          password: "",
          fornavn: "",
          etternavn: "",
          adresse: "",
          postnummer: "",
          poststed: "",
          batplass: "",
          status: "",
          admin: false,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        toast.error("Error registering user");
      });
  };

  return (
    <div className="main-content" data-theme="light">
      <h1 className="header">Bølger og Skvulp (Admin)</h1>
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
      <div className="grid">
        <div className="list">
          <div data-theme="dark" className="user-list">
            <h2>Medlemmer:</h2>
            <ul>
              {userList.map((user) => (
                <li key={user._id}>
                  <Link to={`/admin/user/${user._id}`}>
                    {`${user.fornavn} ${user.etternavn}`}
                  </Link>
                  <button
                    className="secondary"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div data-theme="dark" className="admin-list">
            <h2>Admin List:</h2>
            <ul>
              {adminList.map((user) => (
                <li key={user._id}>
                  {`${user.fornavn} ${user.etternavn}`}
                  <button
                    className="secondary"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="user-registration">
          <h2>Register nytt medlem</h2>
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleNewUserChange}
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleNewUserChange}
            placeholder="Passord"
          />
          <input
            type="text"
            name="fornavn"
            value={newUser.fornavn}
            onChange={handleNewUserChange}
            placeholder="Fornavn"
          />
          <input
            type="text"
            name="etternavn"
            value={newUser.etternavn}
            onChange={handleNewUserChange}
            placeholder="Etternavn"
          />
          <input
            type="text"
            name="adresse"
            value={newUser.adresse}
            onChange={handleNewUserChange}
            placeholder="Adresse"
          />
          <input
            type="text"
            name="postnummer"
            value={newUser.postnummer}
            onChange={handleNewUserChange}
            placeholder="Postnummer"
          />
          <input
            type="text"
            name="poststed"
            value={newUser.poststed}
            onChange={handleNewUserChange}
            placeholder="Poststed"
          />
          <input
            type="text"
            name="batplass"
            value={newUser.batplass}
            onChange={handleNewUserChange}
            placeholder="Båtplass"
          />
          <input
            type="text"
            name="status"
            value={newUser.status}
            onChange={handleNewUserChange}
            placeholder="Status (hvilke uker)"
          />
          <label>
            Admin:
            <input
              type="checkbox"
              name="admin"
              checked={newUser.admin}
              onChange={handleNewUserChange}
            />
          </label>
          <button onClick={handleRegisterUser}>Register User</button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
