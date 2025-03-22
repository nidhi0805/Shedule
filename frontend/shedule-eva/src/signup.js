import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, Grid2, Box, Container, Checkbox, FormControlLabel } from '@mui/material';
import { useHistory } from 'react-router-dom';

const signupData = {
  "Self-Care": [
    "Skincare routine",
    "Reading a book",
    "Journaling",
    "Taking a bath",
    "Digital detox"
  ],
  "Physical Health": [
    "Morning walk",
    "Home workout",
    "Yoga",
    "Dance class",
    "Strength training"
  ],
  "Mental Wellness": [
    "Meditation",
    "Gratitude journaling",
    "Breathing exercises",
    "Therapy session",
    "Guided visualization"
  ],
  "Productivity & Growth": [
    "Learning a new skill",
    "Weekly reflection",
    "Listening to podcasts",
    "Declutter workspace",
    "Personal finance check-in"
  ]
};

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    selectedCategories: []
  });

  const handleNext = () => {
    if (step === 1 && formData.name && formData.dateOfBirth) {
      setStep(2);
    }
  };

  const handleSubmit = () => {
    if (formData.selectedCategories.length === 4) {
      alert("Form submitted!");
    } else {
      alert("Please select 4 categories.");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCategorySelect = (category) => {
    setFormData(prevState => {
      const selectedCategories = [...prevState.selectedCategories];
      if (selectedCategories.includes(category)) {
        const index = selectedCategories.indexOf(category);
        selectedCategories.splice(index, 1);
      } else if (selectedCategories.length < 4) {
        selectedCategories.push(category);
      }
      return {
        ...prevState,
        selectedCategories
      };
    });
  };

  return (
    <Container maxWidth="sm">
      {step === 1 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
          <Typography variant="h4" gutterBottom>Sign Up</Typography>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
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
          />
          <Button variant="contained" color="primary" onClick={handleNext} sx={{ marginTop: 2 }}>
            Next
          </Button>
        </Box>
      )}

      {step === 2 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
          <Typography variant="h4" gutterBottom>Choose 4 Categories</Typography>
          <Typography variant="body1" gutterBottom>Select a total of 4 activities from any category.</Typography>
          <Grid2 container spacing={3} justifyContent="center">
            {Object.entries(signupData).map(([category, items]) => (
              <Grid2 item xs={12} md={6} key={category}>
                <Card sx={{ padding: 2, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{category}</Typography>
                    {items.map((item) => (
                      <FormControlLabel
                        key={item}
                        control={
                          <Checkbox
                            checked={formData.selectedCategories.includes(item)}
                            onChange={() => handleCategorySelect(item)}
                          />
                        }
                        label={item}
                      />
                    ))}
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
          <Box sx={{ marginTop: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={formData.selectedCategories.length !== 4}
            >
              Submit
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Signup;
