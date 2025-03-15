import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField} from '@mui/material';
import AddPuppyForm from './AddPuppyForm';

function Page() {
    //create state variables
    const [puppies, setPuppies] = useState([]);
    const [error, setError] = useState(null);
    const [editingPuppyId, setEditingPuppyId] = useState(false);
    const [editingPuppyData, setEditingPuppyData] = useState(null);

    //fetch puppies from backend (GET all)
    useEffect(() => {
        const fetchPuppies = async () => {
            try {
                const response = await axios.get('http://localhost:5000/puppies');
                setPuppies(response.data);
            } catch (err) {
                setError(err);
                console.error("Error fetching puppies:", err);
            }
        };
    
        fetchPuppies();
    }, []);

    const handleAddPuppy = async (newPuppy) => {
        try {
          const response = await axios.post('http://localhost:5000/puppy', newPuppy);
          setPuppies([...puppies, response.data]);
        } catch (error) {
          console.error("Error adding puppy:", error);
        }
    };

    const handleDeletePuppy = async (puppyId) => {
        try {
            await axios.delete(`http://localhost:5000/puppy/${puppyId}`);
            setPuppies(puppies.filter(puppy => puppy.pet_id !== puppyId));
        } catch (error) {
            console.error("Error deleting puppy:", error);
        }
    }

    const handleEditPuppy = (puppy) => {
        console.log('Editing puppy:', puppy);  // Log the puppy to see its structure
        if (puppy && typeof puppy === 'object') {
            setEditingPuppyId(puppy.pet_id); // Mark this puppy as the one being edited
            setEditingPuppyData({ ...puppy }); // Make a copy of the puppy data to edit
        } else {
            console.error('Invalid puppy object:', puppy);
        }
    };

    const handleSavePuppy = async () => {
        try {
            // Ensure that we're sending only the relevant properties of editingPuppy
            const { pet_id, name, breed, age_est, current_kennel_number } = editingPuppyData;
    
            const response = await axios.put(
                `http://localhost:5000/puppy/${pet_id}`,
                { pet_id, name, breed, age_est, current_kennel_number } // Only send relevant data
            );
    
            const updatedPuppies = puppies.map(puppy =>
                puppy.pet_id === pet_id ? response.data : puppy
            );
            setPuppies(updatedPuppies);  // Update the list with the modified puppy
            setEditingPuppyId(null);  // Stop editing
            setEditingPuppyData(null);  // Clear the editing state
        } catch (error) {
            console.error("Error updating puppy:", error);
        }
    };

    const handleCancelEdit = () => {
        setEditingPuppyId(null);
        setEditingPuppyData(null);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingPuppyData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div>
            <h1>Puppies CRUD App</h1>
            <br />
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Breed</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Current Kennel Number</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {puppies.map((puppy) => (
                            <TableRow key={puppy.pet_id}>
                                <TableCell>{puppy.pet_id}</TableCell>
                                <TableCell>
                                    {editingPuppyId === puppy.pet_id ? (
                                        <TextField
                                            value={editingPuppyData?.name || ''}
                                            name="name"
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        puppy.name
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingPuppyId === puppy.pet_id ? (
                                        <TextField
                                            value={editingPuppyData?.breed || ''}
                                            name="breed"
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        puppy.breed
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingPuppyId === puppy.pet_id ? (
                                        <TextField
                                            value={editingPuppyData?.age_est || ''}
                                            name="age_est"
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        puppy.age_est
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingPuppyId === puppy.pet_id ? (
                                        <TextField
                                            value={editingPuppyData?.current_kennel_number || ''}
                                            name="current_kennel_number"
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        puppy.current_kennel_number
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingPuppyId === puppy.pet_id ? (
                                        <>
                                            <Button variant="contained" color="success" onClick={handleSavePuppy}
                                                sx={{ mr: 1 }}>
                                                Save
                                            </Button>
                                            <Button variant="contained" color="secondary" onClick={handleCancelEdit}
                                                sx={{ mr: 1 }}>
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <Button variant="contained" color="primary" onClick={() => handleEditPuppy(puppy)}
                                            sx={{ mr: 1 }}>
                                            Edit
                                        </Button>
                                    )}
                                    <Button variant="contained" color="error" onClick={() => handleDeletePuppy(puppy.pet_id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <br />
            <h2>Add Puppy</h2>
            <AddPuppyForm onSubmit={handleAddPuppy} />
        </div>
    );
}

export default Page;