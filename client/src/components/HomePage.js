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

    handleResize(); // Initialize the toggle button position on component mount

    window.addEventListener('resize', handleResize); // Add event listener for resize

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup event listener on component unmount
    };
  }, []);

  const toggleButtonStyle = {
    position: 'absolute',
    top: '10px', // Adjust top position as desired
    right: sidebarOpen ? '400px' : '10px', // Adjust right position as desired
    width: '30px', // Adjust width as desired
    height: '30px', // Adjust height as desired
    borderRadius: '50%',
    backgroundColor: '#000', // Replace with your desired background color
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff', // Replace with your desired text color
    fontSize: '16px', // Adjust font size as desired
    fontWeight: 'bold',
    textTransform: 'uppercase',
    transition: 'right 0.3s ease-in-out', // Add transition effect for smooth animation
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
