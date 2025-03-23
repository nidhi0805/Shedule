import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, CardMedia, Box, Container, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './newsignup.css'; 
import scheduleLogo from "../images/logo_shedule.png";
import { toast, ToastContainer } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
  });
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = [];
    if (!formData.name) newErrors.push('Name is required.');
    if (!formData.email) {
      newErrors.push('Email is required.');
    } else if (!validateEmail(formData.email)) {
      newErrors.push('Invalid email address.');
    }
    if (!formData.dateOfBirth) newErrors.push(' Date of Birth is required.');
    return newErrors;
  };

  const handleNext = async () => {
    setFormSubmitted(true);
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors([]); 
      try {
        setIsSubmitting(true); 
        const response = await fetch(`${process.env.REACT_APP_API_URL}/add-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            name: formData.name,
            dob: formData.dateOfBirth,
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('User added:', data);
          sessionStorage.setItem('userEmail', formData.email);
          navigate('/Calendar'); 
        } 
      } catch (error) {
        console.error('Error:', error);
        toast.error("There was an error with the sign-up process.");
      } finally {
        setIsSubmitting(false); 
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box className="card-container">
        <Card className="card">
          <CardContent className='card-content'>
            <CardMedia className='card-media'
              component="img"
              height="194"
              image={scheduleLogo}
              alt="Logo"
            />

         
            {formSubmitted && errors.length > 0 && (
              <Alert className="error-popup" severity="error">
                {errors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </Alert>
            )}

            <Box marginBottom={2}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="text-field"
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="text-field"
              />
              <TextField
                label="Date of Birth"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                className="text-field-height"
              />
            </Box>

            <Box className="button-container">
              <Button
                variant="contained"
                color="secondary"
                onClick={handleNext}
                className="button"
                disabled={isSubmitting} 
              >
                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Signup;
