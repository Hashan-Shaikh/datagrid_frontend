import React from 'react';
import { TextField, Box } from '@mui/material';

const SearchBar = ({ searchTerm, onSearchChange }) => {
    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 3 }}>
            <TextField
                id="filled-search"
                label="Search"
                type="search"
                variant="filled"
                value={searchTerm}
                onChange={onSearchChange}
                fullWidth
            />
        </Box>
    );
}

export default SearchBar;
