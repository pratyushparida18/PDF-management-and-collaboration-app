import React from "react";

const FileRow = ({ file, handleFileClick, handlePreviewClick, openPopup }) => {
  return (
    <tr key={file.file_id}>
      <td
        onClick={() => handleFileClick(file)}
        style={{ border: "1px solid black", cursor: "pointer" }}
      >
        <div className="comment-wrapper">
          <div className="colored-div">{file.filename}</div>
          <div className="comment">{file.comment}</div>
        </div>
      </td>
      <td style={{ border: "1px solid black", cursor: "pointer" }}>
        <button
          style={{ cursor: "pointer" }}
          onClick={() => handlePreviewClick(file.file_id)}
        >
          Preview
        </button>
      </td>
      <td style={{ border: "1px solid black", cursor: "pointer" }}>
        <button
          style={{ cursor: "pointer" }}
          onClick={() => openPopup(file)}
        >
          Share
        </button>
      </td>
    </tr>
  );
};

export default FileRow;
