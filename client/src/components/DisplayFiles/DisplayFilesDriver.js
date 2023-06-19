import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import SearchBar from "./SearchBar";
import FileRow from "./FileRow";
import SelectedFile from "./SelectedFile";
import SearchResults from "./SearchResults";
import './styles/DisplayFilesStyles.css';


const FilesTable = ({ email }) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [share_URL, setShare_URL] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [showInviteSection, setShowInviteSection] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteURL, setInviteURL] = useState("");
  const [currentFile, setCurrentFile] = useState("");

  useEffect(() => {
    axios
      .get(`https://pdf-managementapp.onrender.com/getfiles?email=${email}`)
      .then((response) => {
        setFiles(response.data.files);
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  }, files);

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setSearchResults([]);
    setSearchText("");
  };

  const handleSearch = () => {
    axios
      .get(
        `https://pdf-managementapp.onrender.com/singleFileData?filename=${searchText}&email=${email}`
      )
      .then((response) => {
        setSearchResults(response.data.comments);
        setSelectedFile(null);
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
      });
  };

  const handlePreviewClick = (fileId) => {
    axios
      .get(`https://pdf-managementapp.onrender.com/preview/?file_id=${fileId}`, {
        responseType: "blob",
      })
      .then((response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      })
      .catch((error) => {
        console.error("Error fetching file preview:", error);
      });
  };

  const handleShareClick = (fileId) => {
    axios
      .get(`https://pdf-managementapp.onrender.com/preview/?file_id=${fileId}`, {
        responseType: "blob",
      })
      .then((response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        setShare_URL(fileURL);
        setPopupOpen(true); // Open the popup with the share URL
      })
      .catch((error) => {
        console.error("Error fetching file preview:", error);
      });
  };

  const openPopup = (file) => {
    handleShareClick(file.file_id); // Fetch the share URL
    setPopupOpen(true); // Open the popup
    setCurrentFile(file); // Set the current file
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(share_URL);
  };

  const handleInviteUser = () => {
    
    axios
      .get(`https://pdf-managementapp.onrender.com/preview/?file_id=${currentFile.file_id}`, {
        responseType: "blob",
      })
      .then((response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        const uniqueId = uuidv4();
        const inviteLink = fileURL + "?invite=" + uniqueId;
        setInviteURL(inviteLink);
        console.log("inviteURL=",inviteURL);
        console.log("uniqueId=",uniqueId);
      })
      .catch((error) => {
        console.error("Error fetching invite link:", error);
      });
      

    axios
      .put(
        `https://pdf-managementapp.onrender.com/invitations?inviteEmail=${inviteEmail}&inviteURL=${inviteURL}&filename=${currentFile.filename}&sender_email=${email}&file_id=${currentFile.file_id}`
      )
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error("Error updating invitations:", error);
      });

      console.log(inviteURL);
    axios
      .put(
        `https://pdf-managementapp.onrender.com/uniqueIdCheck?inviteEmail=${inviteEmail}&inviteURL=${inviteURL}`
      )
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error("Error updating record:", error);
      });

    // Clear the invite email input field
    setInviteEmail("");
    setShowInviteSection(false);
  };

  // CSS styles as a JavaScript object
  const popupStyles = {
    popup: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    popupContent: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 5,
      maxWidth: 400,
      width: "100%",
    },
  };

  const popupRef = useRef(null); // Reference to the popup

  const handleClickOutside = (event) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target) &&
      event.target.id !== "popupButton1" &&
      event.target.id !== "popupButton2" &&
      event.target.id !== "popupButton3" &&
      event.target.id !== "popupButton4"
    ) {
      setPopupOpen(false);
      setShowInviteSection(false);
    }
  };
  
  useEffect(() => {
    // Event listener to close the popup on outside click
    window.addEventListener("click", handleClickOutside);
  
    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="container">
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        handleSearch={handleSearch}
        className="search-bar"
      />

      <div className="table-container">
        <table style={{ borderCollapse: "collapse" }} className="files-table">
          <thead>
            <tr>
              <th
                colSpan="3"
                style={{ border: "1px solid black", textAlign: "center" }}
              >
                Files
              </th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <FileRow
                key={file.file_id}
                file={file}
                handleFileClick={handleFileClick}
                handlePreviewClick={handlePreviewClick}
                openPopup={openPopup}
              />
            ))}
          </tbody>
        </table>
      </div>

      {selectedFile && <SelectedFile selectedFile={selectedFile} className="selected-file" />}

      {searchResults.length > 0 && (
        <SearchResults searchResults={searchResults} />
      )}

      {popupOpen && (
        <div style={popupStyles.popup}>
          <div style={popupStyles.popupContent} ref={popupRef}>
            <h3>Share URL:</h3>
            <input
              type="text"
              value={share_URL}
              readOnly
              style={{ width: "100%", height: 30 }}
            />
            <div id="popupButtonContainer">
              <button onClick={copyToClipboard} id="popupButton1">Copy</button>
              <button onClick={() => {setPopupOpen(false); setShowInviteSection(false);}} id="popupButton2">Close</button>
            </div>

            {!showInviteSection && (
              <button onClick={() => setShowInviteSection(true)} id="popupButton3">
                Invite Users
              </button>
            )}

            {showInviteSection && (
              <div>
                <h3>Invite Users:</h3>
                <input
                  type="text"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                  }}
                  placeholder="Enter email"
                  style={{ width: "63%", height: 30, marginBottom: 20 }}
                />
                <button onClick={handleInviteUser} id="popupButton4">Invite</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesTable;
