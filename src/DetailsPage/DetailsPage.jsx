import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Typography, Box, Container, Paper } from '@mui/material';

const DetailsPage = () => {
    const { id } = useParams(); //extract id from url paramters
    const navigate = useNavigate(); //initialize navigate hook for navigation
    const [record, setRecord] = useState({}); //set the record when fetched by its id


    //fetch the record from backend api through the id
    useEffect(() => {
        console.log(id);
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/dynamic/view?_id=${id}`)
            .then((response) => {
                setRecord(response.data);
            })
            .catch(error => console.error(error));
    }, [id]);

    //navigate to the previous page in stack
    const navigateBack = () => {
        navigate(-1);
    }

    return (
        <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
            <Paper sx={{ padding: 3, backgroundColor: '#f9f9f9', boxShadow: 3 }}>
                <Typography variant="h4" gutterBottom align="center" color="primary">
                    Record Details
                </Typography>
                {Object.keys(record).length > 0 ? (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, 1fr)', //for setting css grid of 5 columns
                            gap: 2,
                            mt: 3,
                        }}
                    >
                        {Object.keys(record).map((key) => (
                            <Box
                                key={key}
                                sx={{
                                    border: '1px solid #ddd',
                                    borderRadius: 2,
                                    padding: 2,
                                    backgroundColor: '#fff',
                                    boxShadow: 1,
                                }}
                            >
                                <Typography variant="h6" color="primary">
                                    {key}
                                </Typography>
                                <Typography variant="body1">{record[key]}</Typography>
                            </Box>
                        ))}
                    </Box>
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
