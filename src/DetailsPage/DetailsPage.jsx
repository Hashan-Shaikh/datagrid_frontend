import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Typography, Box, Container, List, ListItem, ListItemText, Paper } from '@mui/material';

const DetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [record, setRecord] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:3000/dynamic/view?_id=${id}`)
            .then((response) => {
                setRecord(response.data);
            })
            .catch(error => console.error(error));
    }, [id]);

    const navigateBack = () => {
        navigate(-1);
    }

    return (
        <Container maxWidth="sm" sx={{ pt: 4, pb: 4 }}>
            <Paper sx={{ padding: 3, backgroundColor: '#f9f9f9', boxShadow: 3 }}>
                <Typography variant="h4" gutterBottom align="center" color="primary">
                    Record Details
                </Typography>
                {Object.keys(record).length > 0 ? (
                    <List>
                        {Object.keys(record).map((key) => (
                            <ListItem key={key} sx={{ mb: 2 }}>
                                <ListItemText
                                    primary={<Typography color='primary' variant="h6">{key}</Typography>}
                                    secondary={<Typography variant="body1">{record[key]}</Typography>}
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body1" align="center">Loading...</Typography>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={navigateBack}
                        sx={{ fontSize: 16 }}
                    >
                        Go Back
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default DetailsPage;
