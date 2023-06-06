import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
function RegisterMany() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    // Read the contents of the file
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = async (event) => {
      // Parse the contents of the file as JSON
      const users = JSON.parse(event.target.result);

      // Send the users to the /registerMany endpoint
      const response = await axios.post(`http://localhost:25584/registerMany`, {
        users,
      });
      console.log(response.data);
      toast.success(response.data.message);
      setFile(null);
    };
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default RegisterMany;
