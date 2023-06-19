import React from 'react';

const InvitationItem = ({ invitation, handleInviteClick }) => {
  return (
    <div key={invitation.filename}>
      <h3>{invitation.filename}</h3>
      <p>
        <a href="#" onClick={() => handleInviteClick(invitation.file_id)}>
          {invitation.inviteURL}
        </a>
      </p>
    </div>
  );
};

export default InvitationItem;
