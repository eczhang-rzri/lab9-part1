import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';

const AddPuppyForm = ({ onSubmit }) => {
  const initialFormData = {
    name: '',
    breed: '',
    age: null,
    current_kennel_number: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    setFormData(initialFormData);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Call onSubmit
    // Clear the form only when ADDING
    setFormData(initialFormData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          type="text"
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          required
          fullWidth
          sx={{ backgroundColor: 'white' }}
        />
        <TextField
          type="text"
          name="breed"
          label="Breed"
          value={formData.breed}
          onChange={handleChange}
          fullWidth
          sx={{ backgroundColor: 'white' }}
        />
        <TextField
          type="number"
          name="age_est"
          label="Age"
          value={formData.age_est}
          onChange={handleChange}
          fullWidth
          sx={{ backgroundColor: 'white' }}
        />
        <TextField
          type="number"
          name="current_kennel_number"
          label="Current Kennel Number"
          value={formData.current_kennel_number}
          onChange={handleChange}
          fullWidth
          sx={{ backgroundColor: 'white' }}
        />
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          {"Add Puppy"}
        </Button>
      </Box>
    </form>
  );
};

export default AddPuppyForm;