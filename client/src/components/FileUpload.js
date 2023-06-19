import React, { useState } from 'react';
import axios from 'axios';
import './styles/FileUploadStyles.css';

const FileUpload = ({ email }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`https://pdf-managementapp.onrender.com/upload/${email}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus(`File uploaded successfully. File ID: ${response.data.file_id}`);
    } catch (error) {
      setUploadStatus('File upload failed.');
    }
  };

  return (
    <div className="FileUploadContainer">
      <input className="FileUploadInput" type="file" onChange={handleFileChange} />
      <button className="FileUploadButton" onClick={handleUpload}>Upload</button>
      {uploadStatus && <p className="FileUploadStatus">{uploadStatus}</p>}
    </div>
  );
};

export default FileUpload;
