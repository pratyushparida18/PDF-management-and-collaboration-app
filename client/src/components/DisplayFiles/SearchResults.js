import React from "react";

const SearchResults = ({ searchResults }) => {
  return (
    <div className="SelectedFile-container">
      <h3>Search Results:</h3>
      <div className="comments-container">
      <ul>
        {searchResults.map((comment, index) => {
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

export default SearchResults;
