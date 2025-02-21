import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { addActivity, getAllActivities } from '../api';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/system';
import './AddActivityForm.css';

const Input = styled('input')({
  display: 'none',
});

const AddActivityForm = ({ onActivityAdded }) => {
  const { id: menteeId } = useParams(); // Use useParams to get the menteeId from the URL
  const [activityData, setActivityData] = useState({ menteeId, name: '', type: '', description: '', pdf: null });
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const fetchedActivities = await getAllActivities(menteeId);
        setActivities(fetchedActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    if (menteeId) {
      fetchActivities();
    }
  }, [menteeId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setActivityData({ ...activityData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleFileChange = (event) => {
    console.log(event.target.files[0])
    setActivityData({ ...activityData, pdf: event.target.files[0] });
  };

  const validate = () => {
    const newErrors = {};
    if (!activityData.name) newErrors.name = 'Activity name is required';
    if (!activityData.type) newErrors.type = 'Activity type is required';
    if (!activityData.description) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!menteeId) {
      console.error('Mentee ID is not defined');
      return;
    }
    if (!validate()) return;
    try {
      const newActivity = {
        menteeId,
        name: activityData.name,
        type: activityData.type,
        description: activityData.description,
        pdf: activityData.pdf,
      };
      const savedActivity = await addActivity(newActivity);
      setActivities([...activities, savedActivity]);
      onActivityAdded(savedActivity);
      setActivityData({ menteeId, name: '', type: '', description: '', pdf: null });
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
  };

  const handleCloseDialog = () => {
    setSelectedActivity(null);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Add Activity
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Activity Name"
              name="name"
              value={activityData.name}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name}
            />
            {/* Commented out dropdown for future use */}
            {/* <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.type}>
              <InputLabel>Activity Type</InputLabel>
              <Select
                label="Activity Type"
                name="type"
                value={activityData.type}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Sports">Sports</MenuItem>
                <MenuItem value="Literature">Literature</MenuItem>
                <MenuItem value="Music">Music</MenuItem>
                <MenuItem value="Art">Art</MenuItem>
                {/* Add more options as needed */}
              {/* </Select>
              {errors.type && <Typography color="error">{errors.type}</Typography>}
            </FormControl> */}
            <TextField
              fullWidth
              label="Activity Type"
              name="type"
              value={activityData.type}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              error={!!errors.type}
              helperText={errors.type}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={activityData.description}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description}
            />
            <label htmlFor="pdf-upload">
              <Input
                accept="application/pdf"
                id="pdf-upload"
                type="file"
                onChange={handleFileChange}
              />
              <Button variant="contained" component="span" sx={{ mt: 2 }}>
                Upload PDF
              </Button>
            </label>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
              Add Activity
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Typography variant="h5" align="center" gutterBottom sx={{ mt: 5 }}>
        Activity List
      </Typography>
      <List>
        {activities.map((activity, index) => (
          <ListItem key={index} divider button onClick={() => handleActivityClick(activity)}>
            <ListItemText
              primary={<strong>{activity.name}</strong>}
              secondary={
                <>
                  <strong>Type:</strong> {activity.type} <br />
                  <strong>Description:</strong> {activity.description}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      {selectedActivity && (
        <Dialog open={!!selectedActivity} onClose={handleCloseDialog}>
          <DialogTitle>Activity Details</DialogTitle>
          <DialogContent>
            <Typography variant="h6">{selectedActivity.name}</Typography>
            <Typography variant="subtitle1">Type: {selectedActivity.type}</Typography>
            <Typography variant="body1">{selectedActivity.description}</Typography>
            {selectedActivity.pdfPath && (
              <Typography variant="body1">
                <a href={`http://localhost:5000/${selectedActivity.pdfPath}`} target="_blank" rel="noopener noreferrer">
                  View PDF
                </a>
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} variant="contained" color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default AddActivityForm;
