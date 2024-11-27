import React, { useState, useEffect } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import { GrFormView } from "react-icons/gr";
import { MdOutlineDelete } from "react-icons/md";
import { Button, ButtonGroup, Menu, MenuItem, TextField, IconButton, Select, MenuItem as MuiMenuItem, InputLabel, FormControl, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Box, Typography, Paper, Grid2 } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import { CiFilter } from "react-icons/ci";
import { operations } from '../operations/operations';
import SearchBar from './SearchBar';
import DataTable from './DataTable';

const HomePage = () => {

    const [rowData, setRowData] = useState([]);
    const [colHeaders, setColHeaders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [columnDefs, setColumnDefs] = useState([{}]);
    const [openModal, setOpenModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [filterParams, setFilterParams] = useState({
        column: '',
        operation: '',
        value: ''
    });

    const [anchorEl, setAnchorEl] = useState(null); //for dropdown anchor

    const navigate = useNavigate();

    useEffect(() => {
        if (searchTerm) {
            axios.get(`http://localhost:3000/dynamic/search?searchTerm=${searchTerm}`)
                .then((response) => {
                    setRowData(response.data)
                })
                .catch(error => console.error(error));
        } else {
            // Fetch all data when there is no search term
            axios.get('http://localhost:3000/dynamic')
                .then((response) => {
                    setColHeaders(response.data.headers)
                    setRowData(response.data.data)
                })
                .catch(error => console.error(error));
        }
    }, [searchTerm]);

    const onSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleView = (searchId) => {
        navigate(`/details/${searchId}`);
    }

    // Open the modal when delete button is clicked
    const handleDelete = (searchId) => {
        setDeleteId(searchId);
        setOpenModal(true);
    }

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterSelect = (operation) => {
        setFilterParams(prev => ({ ...prev, operation }));
    };

    const handleFilterColumnChange = (event) => {
        const column = event.target.value;
        setFilterParams(prev => ({ ...prev, column }));
    }

    const handleFilterValueChange = (event) => {
        setFilterParams(prev => ({ ...prev, value: event.target.value }));
    };

    const handleFilterApply = () => {
        const { column, operation, value } = filterParams;
        setAnchorEl(false);

        // Make an API call to apply filter
        axios.get(`http://localhost:3000/dynamic/filter?column=${column}&operation=${operation}&value=${value}`)
        .then((response) => {
            setRowData(response.data);
        })
        .catch(error => console.error(error));
    };

    const handleConfirmDelete = () => {
        // Call the delete API if user confirms
        axios.delete(`http://localhost:3000/dynamic/delete?_id=${deleteId}`)
            .then(response => {
                // Close the modal and reload data
                setOpenModal(false);
                setRowData(prevData => prevData.filter(item => item._id !== deleteId)); // Remove from UI
            })
            .catch(error => {
                console.error(error);
                setOpenModal(false); // Close modal on error
            });
    }

    const handleCloseModal = () => {
        setOpenModal(false); // Close the modal if user cancels
    }


    const Action = {
        headerName: "Actions", 
        // headerComponent: (props) => (
        //     <div>
        //         <span>{props.displayName}</span>
        //         <IconButton
        //             onClick={(event) => handleFilterClick(event)}
        //             size="small"
        //         >
        //             <CiFilter />
        //         </IconButton>
        //     </div>
        // ),
        cellRenderer: (params) => (
            <Box sx={{display:"flex", alignItems:"center", justifyContent:"center"}}>
            <ButtonGroup variant="contained" aria-label="action buttons" sx={{pt:0.5}}>
                <Button 
                    onClick={() => handleView(params.data._id)} 
                    startIcon={<GrFormView />}
                    color='primary'
                />
                <Button 
                    onClick={() => handleDelete(params.data._id)} 
                    startIcon={<MdOutlineDelete />}
                    sx={{backgroundColor:"#f76f6f"}}
                />
            </ButtonGroup>
            </Box>
        ),
    }


    useEffect(()=>{
        
        let columnInfo = {};
        let colDefs = [];

        colDefs.push(Action);
        
        colHeaders?.forEach((header)=>{
            columnInfo = {
                headerName: header,
                field: header,
            }
            colDefs.push(columnInfo)
        })

        setColumnDefs(colDefs);

    }, [colHeaders])


    return (
        <Box sx={{ p: 4 }}>
            {/* Header with Typography */}
            {/* <Typography variant="h4" component="h1" gutterBottom>
                Generic Data Grid App
            </Typography> */}

            <Typography variant="h4" component="div" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                    component="img"
                    src="./bmw.svg" // Replace with your image URL
                    alt="BMW LOGO"
                    sx={{ width: 40, height: 40, marginRight: 2 }} // Adjust size and spacing as needed
                />
                Generic Data Grid App
            </Typography>

            <Paper sx={{ px: 2, pb:2, mb: 4, display:"flex", alignItems:"center", gap:2 }}>
                {/* Search Bar Section */}
                <Button sx={{backgroundColor:"#1565c0", height:50, width:100, mt:3, gap:1}} onClick={(event) => handleFilterClick(event)} size="large" ><CiFilter color='white' /><Typography color='white' sx={{textTransform:"none"}}>Filter</Typography></Button>
                <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
            </Paper>

            
            {/* Data Table Section */}
            <DataTable columnDefs={columnDefs} rowData={rowData} />
            

            {/* Filter Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                {/* Column Dropdown */}
                <MenuItem>
                    <FormControl fullWidth>
                        <InputLabel>Select Column</InputLabel>
                        <Select
                            value={filterParams.column}
                            onChange={handleFilterColumnChange}
                            label="Select Column"
                        >
                            {colHeaders.map((header) => (
                                <MuiMenuItem key={header} value={header}>
                                    {header}
                                </MuiMenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </MenuItem>

                {/* Operations Dropdown */}
                <MenuItem>
                    <FormControl fullWidth>
                        <InputLabel>Select Operation</InputLabel>
                        <Select
                            value={filterParams.operation}
                            onChange={(event) => handleFilterSelect(event.target.value)}
                            label="Select Operation"
                        >
                            {operations.map((operation) => (
                                <MuiMenuItem key={operation} value={operation}>
                                    {operation}
                                </MuiMenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </MenuItem>
                
                {/* Value Field */}
                <MenuItem>
                    <TextField
                            label={`Filter ${filterParams.column}`}
                            value={filterParams.value}
                            onChange={handleFilterValueChange}
                        />
                    <Button onClick={handleFilterApply}>Apply Filter</Button>
                </MenuItem>
            </Menu>

            {/* Confirmation Modal */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this record?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default HomePage;
