import React from "react";

const SelectedFile = ({ selectedFile }) => {
  return (
    <div className="SelectedFile-container">
      <h3>Selected File: {selectedFile.filename}</h3>
      <div className="comments-container">
        <ul>
          {selectedFile.comments.map((comment, index) => {
            const sender = Object.keys(comment)[0];
            const message = Object.values(comment)[0];
            return (
              <li key={index}>
                <strong>{sender}:</strong> {message}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SelectedFile;
