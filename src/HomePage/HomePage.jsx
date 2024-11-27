import React, { useEffect, useState } from 'react';
import { Button, Typography, Box, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [currentLetter, setCurrentLetter] = useState(0);
  const appName = "Generic Data Grid App";

  const navigate = useNavigate(); //initialize navigate hook for navigation

  useEffect(() => {
    // Show one letter every 0.3 seconds
    if (currentLetter < appName.length) {
      const timer = setTimeout(() => setCurrentLetter(currentLetter + 1), 300);
      return () => clearTimeout(timer);
    }
  }, [currentLetter]);

  // Handle file upload
  const handleFileUpload = async (event) => {
    const fileInput = event.target;
    const file = event.target.files[0];
    const formData = new FormData();

    formData.append('file', file, file?.name);

    if (file && file.type === "text/csv") {
      try {
        // Replace with your backend server URL
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/file/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Required for file uploads
          },
        });

        // Handle the response from the backend
        console.log("File uploaded successfully:", response.data);
        navigate('/grid');
        alert("File uploaded successfully!");

      } catch (error) {
        // Handle any errors during the file upload
        console.error("Error uploading file:", error);
        alert("Failed to upload file. Please try again.");
      }
    } 
    else {
      alert("Please upload a valid CSV file.");
    }

    // Reset the file input value so the same file can be uploaded again
    fileInput.value = null;
  };


  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      {/* BMW Logo */}
      <Box sx={{ mb: 4 }}>
        <img
          src={'./bmw.svg'} 
          alt="BMW Logo"
          style={{ width: '200px', height: 'auto' }}
        />
      </Box>

      {/* App Name with Animation */}
      <Typography
        variant="h4"
        component="div"
        sx={{
          fontWeight: 'bold',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          fontSize: '2rem',
          textAlign: 'center',
          color: 'black',
        }}
      >
        {appName.split("").map((letter, index) => (
          <span
            key={index}
            style={{
              opacity: index < currentLetter ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              margin: '0 2px',
            }}
          >
            {letter}
          </span>
        ))}
      </Typography>

      {/* File Uploader */}
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          component="label"
        >
          Upload CSV
          <input
            type="file"
            hidden
            accept=".csv"
            onChange={handleFileUpload}
          />
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
