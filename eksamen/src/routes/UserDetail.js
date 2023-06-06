import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../CSS/UserDetail.css";

export default function UserDetail() {
  const { userId } = useParams();
  const nav = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSave = () => {
    axios
      .put(`http://localhost:25584/updateUser/${userId}`, userData)
      .then((response) => {
        toast.success("User information updated successfully!");
        setEditMode(false);
      })
      .catch((error) => {
        toast.error("Failed to update user information.");
        // handle the error
      });
  };

  const handleBack = () => {
    nav("/admin");
  };

  useEffect(() => {
    axios
      .get(`http://localhost:25584/getDataUser/${userId}`)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        // handle the error
      });
  }, [userId]);

  return (
    <div className="main-content" data-theme="light">
      <h1 className="header">Bølger og Skvulp</h1>
      <button className="back" onClick={handleBack}>
        Tilbake
      </button>
      {userData && (
        <div className="user-data">
          <h2>Informasjon til : {userData.fornavn}</h2>
          {editMode ? (
            <div className="editForm">
              <div className="first">
                <label>
                  Fornavn:
                  <input
                    type="text"
                    value={userData.fornavn}
                    onChange={(e) =>
                      setUserData({ ...userData, fornavn: e.target.value })
                    }
                  />
                </label>
                <label>
                  Etternavn:
                  <input
                    type="text"
                    value={userData.etternavn}
                    onChange={(e) =>
                      setUserData({ ...userData, etternavn: e.target.value })
                    }
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="text"
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                  />
                </label>
                <label>
                  Adresse:
                  <input
                    type="text"
                    value={userData.adresse}
                    onChange={(e) =>
                      setUserData({ ...userData, adresse: e.target.value })
                    }
                  />
                </label>
              </div>
              <div className="second">
                <label>
                  Postnummer:
                  <input
                    type="text"
                    value={userData.postnummer}
                    onChange={(e) =>
                      setUserData({ ...userData, postnummer: e.target.value })
                    }
                  />
                </label>
                <label>
                  Poststed:
                  <input
                    type="text"
                    value={userData.poststed}
                    onChange={(e) =>
                      setUserData({ ...userData, poststed: e.target.value })
                    }
                  />
                </label>
                <label>
                  Båtplass:
                  <input
                    type="text"
                    value={userData.batplass}
                    onChange={(e) =>
                      setUserData({ ...userData, batplass: e.target.value })
                    }
                  />
                </label>
                <label>
                  Status:
                  <input
                    type="text"
                    value={userData.status}
                    onChange={(e) =>
                      setUserData({ ...userData, status: e.target.value })
                    }
                  />
                </label>
              </div>
              <button className="contrast" onClick={handleSave}>
                Bekreft
              </button>
            </div>
          ) : (
            <div className="data">
              <div className="first">
                <p>Fornavn: {userData.fornavn}</p>
                <p>Etternavn: {userData.etternavn}</p>
                <p>Email: {userData.email}</p>
                <p>Adresse: {userData.adresse}</p>
              </div>
              <div className="second">
                <p>Postnummer: {userData.postnummer}</p>
                <p>Poststed: {userData.poststed}</p>
                <p>Båtplass: {userData.batplass}</p>
                <p>Status: {userData.status}</p>
              </div>
            </div>
          )}
          <button className="edit" onClick={toggleEditMode}>
            {editMode ? "Avbryt" : "Rediger"}
          </button>
        </div>
      )}
    </div>
  );
}
