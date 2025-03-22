import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, Box, Container, Alert } from '@mui/material';
import { useHistory } from 'react-router-dom';

const Signup = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
    return newErrors;
  };

  const handleNext = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      history.push('/next-page');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <Card
          sx={{
            padding: 3,
            boxShadow: 8,
            borderRadius: 5,
            width: '100%',
            background: 'linear-gradient(135deg,rgb(241, 230, 240),rgb(233, 227, 233))',
            color: '#fff',
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              gutterBottom
              textAlign="center"
              sx={{
                fontWeight: 'bold',
                letterSpacing: '2px',
                textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
                marginBottom: 3,
              }}
            >
              Sign Up
            </Typography>
            <Box marginBottom={2}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  style: { backgroundColor: '#fff', borderRadius: '5px' },
                }}
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
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  style: { backgroundColor: '#fff', borderRadius: '5px' },
                }}
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
                    shrink: true, // Ensures the label is always above the input
                }}
                placeholder="" // Removes the placeholder to avoid merging
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
                InputProps={{
                    style: { backgroundColor: '#fff', borderRadius: '5px', height: '56px' },
                }}
              />
            </Box>
            {Object.keys(errors).length > 0 && (
              <Alert severity="error" sx={{ marginBottom: 2, backgroundColor: '#f8d7da', color: '#721c24' }}>
                Please fix the errors above to proceed.
              </Alert>
            )}
            <Box textAlign="center" marginTop={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleNext}
                sx={{
                  paddingX: 4,
                  paddingY: 1.5,
                  fontSize: '16px',
                  fontWeight: 'bold',
                  backgroundColor: '#fbaed2',
                  '&:hover': {
                    backgroundColor: '#f48fb1',
                  },
                }}
              >
                Next
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Signup;