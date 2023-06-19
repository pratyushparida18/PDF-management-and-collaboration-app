import React from "react";

const SearchBar = ({ searchText, handleSearch, setSearchText }) => {
  return (
    <div className="search-bar"> 
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="search-bar-input" 
      />
      <button onClick={handleSearch} id="search-bar-button"> 
        Search
      </button>
    </div>
  );
};

export default SearchBar;
