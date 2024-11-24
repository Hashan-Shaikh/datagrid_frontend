import React from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, ButtonGroup } from '@mui/material';

const Details = () => {

    const { id } = useParams();
    const navigate = useNavigate(); // Hook for navigation
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
        <div>
            <h1>Details</h1>
            {Object.keys(record).length > 0 ? (
                <ul>
                    {Object.keys(record).map((key) => (
                        <li key={key}>
                            <strong>{key}:</strong> {record[key]}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading...</p>
            )}
            <Button onClick={navigateBack}>Back</Button>
        </div>
    );
}

export default Details