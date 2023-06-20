import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import FilesTable from './DisplayFiles/DisplayFilesDriver';
import Sidebar from './sidebar/sidebar';

const HomePage = ({ email }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toggleButtonRight, setToggleButtonRight] = useState('10px');


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const toggleButtonRightValue = screenWidth > 768 ? '400px' : '300px';
      setToggleButtonRight(toggleButtonRightValue);
    };

    handleResize(); 

    window.addEventListener('resize', handleResize); 

    return () => {
      window.removeEventListener('resize', handleResize); 
    };
  }, []);

  const toggleButtonStyle = {
    position: 'absolute',
    top: '10px', 
    right: sidebarOpen ? '400px' : '10px', 
    width: '30px', 
    height: '30px', 
    borderRadius: '50%',
    backgroundColor: '#000', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff', 
    fontSize: '16px', 
    fontWeight: 'bold',
    textTransform: 'uppercase',
    transition: 'right 0.3s ease-in-out',
  };

  return (
    <div>
      <button className={`sidebar-toggle ${sidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}>
        <div style={toggleButtonStyle}>{sidebarOpen ? '|' : '---'}</div>
      </button>

      <FileUpload email={email} />
      <FilesTable email={email} />
      {sidebarOpen && <Sidebar email={email} />}
    </div>
  );
};

export default HomePage;
