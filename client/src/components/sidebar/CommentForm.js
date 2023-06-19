import React, { useState } from 'react';

const textareaStyles = {
  width: '100%',
  height: '200px',
};

const CommentForm = ({ email, invitation, handleSubmit }) => {
  const [comment, setComment] = useState('');

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleFormSubmit = () => {
    handleSubmit(invitation, comment);
    setComment('');
  };

  return (
    <div>
      <textarea
        style={textareaStyles}
        placeholder="Enter your comments here"
        value={comment}
        onChange={handleCommentChange}
      ></textarea>
      <button onClick={handleFormSubmit}>Submit</button>
    </div>
  );
};

export default CommentForm;
