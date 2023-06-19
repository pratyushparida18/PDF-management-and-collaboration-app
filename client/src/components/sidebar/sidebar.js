import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InvitationItem from './InvitationItem';
import CommentForm from './CommentForm';
import './styles/sidebarStyles.css';



const Sidebar = ({ email }) => {
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    axios
      .get(`https://pdf-managementapp.onrender.com/getInvitations/${email}?email=${email}`)
      .then((response) => setInvitations(response.data))
      .catch((error) => console.error(error));
  }, [email]);

  const handleInviteClick = (file_id) => {
    axios
      .get(`https://pdf-managementapp.onrender.com/preview/?file_id=${file_id}`, {
        responseType: 'blob',
      })
      .then((response) => {
        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      })
      .catch((error) => {
        console.error('Error fetching file preview:', error);
      });
  };

  const handleSubmit = (invitation, comment) => {
    axios
      .post(
        `https://pdf-managementapp.onrender.com/save_comment?email=${email}&comment=${comment}&filename=${invitation.filename}`
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className='sidebar'>
    {invitations &&
      invitations.map((invitation) => (
        <div key={invitation.filename} className='item-container'>
          <div className='item-wrapper'>
            <InvitationItem
              invitation={invitation}
              handleInviteClick={handleInviteClick}
            />
            <CommentForm
              email={email}
              invitation={invitation}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      ))}
  </div>
)};

export default Sidebar;
