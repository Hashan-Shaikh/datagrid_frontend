import React, { useState, useEffect } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import { GrFormView } from "react-icons/gr";
import { MdOutlineDelete } from "react-icons/md";
import { Button, ButtonGroup, Menu, MenuItem, TextField, Select, MenuItem as MuiMenuItem, InputLabel, FormControl, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Box, Typography, Paper} from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import { CiFilter } from "react-icons/ci";
import { filterOptions } from '../constants/filterOptions';
import SearchBar from './SearchBar';
import DataTable from './DataTable';

const HomePage = () => {

    const [rowData, setRowData] = useState([]); //for setting all rows of grid
    const [colHeaders, setColHeaders] = useState([]); //for settting col headers
    const [searchTerm, setSearchTerm] = useState(''); //for setting searched value in a grid
    const [columnDefs, setColumnDefs] = useState([{}]); //we use col headers to map col definition which is used by grid
    const [openModal, setOpenModal] = useState(false); //for opening dialog modal
    const [deleteId, setDeleteId] = useState(null); //setting deleteId for the record to be deleted

    //state made to set filtering params in a single state and request to backend api
    const [filterParams, setFilterParams] = useState({
        column: '',
        operation: '',
        value: ''
    });

    //controls the whole filter menu
    const [anchorEl, setAnchorEl] = useState(null);

    const navigate = useNavigate();

    //for first time load all the data but call api again if search term is changed
    useEffect(() => {
        if (searchTerm) {
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/dynamic/search?searchTerm=${searchTerm}`)
                .then((response) => {
                    setRowData(response.data)
                })
                .catch(error => console.error(error));
        } else {
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/dynamic`)
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

    //navigate to details page
    const handleView = (searchId) => {
        navigate(`/details/${searchId}`);
    }

    const handleDelete = (searchId) => {
        setDeleteId(searchId);
        setOpenModal(true);
    }

    //opens or close the filter menu
    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    //set the operation field for filter
    const handleFilterSelect = (operation) => {
        setFilterParams(prev => ({ ...prev, operation }));
    };

    //set the column field for filter
    const handleFilterColumnChange = (event) => {
        const column = event.target.value;
        setFilterParams(prev => ({ ...prev, column }));
    }
    
    //set the value field for filter
    const handleFilterValueChange = (event) => {
        setFilterParams(prev => ({ ...prev, value: event.target.value }));
    };

    // - destructure filter state object
    // - close the filter menu
    // - make the request to a filter api by sending every value in the url query params
    const handleFilterApply = () => {
        const { column, operation, value } = filterParams;
        setAnchorEl(false);

        axios.get(`${process.env.REACT_APP_BACKEND_URL}/dynamic/filter?column=${column}&operation=${operation}&value=${value}`)
        .then((response) => {
            setRowData(response.data);
        })
        .catch(error => console.error(error));
    };

    //call the delete api on backend to delete a record and then filter the exisiting data on frontend
    const handleConfirmDelete = () => {
        
        axios.delete(`${process.env.REACT_APP_BACKEND_URL}/dynamic/delete?_id=${deleteId}`)
            .then(response => {
                setOpenModal(false);
                setRowData(prevData => prevData.filter(item => item._id !== deleteId));
            })
            .catch(error => {
                console.error(error);
                setOpenModal(false); 
            });
    }

    const handleCloseModal = () => {
        setOpenModal(false); 
    }

    //make an additional column named as actions in ag grid for performing viewing and deleting actions
    const Action = {
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

    //using column headers to make column definitions for ag grid
    //call useEffect everytime column header changes
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

            <Typography variant="h4" component="div" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                    component="img"
                    src="./bmw.svg" 
                    alt="BMW LOGO"
                    sx={{ width: 40, height: 40, marginRight: 2 }} 
                />
                Generic Data Grid App
            </Typography>

            <Paper sx={{ px: 2, pb:2, mb: 4, display:"flex", alignItems:"center", gap:2 }}>
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
                            disabled={filterParams.column === ""}
                            value={filterParams.operation}
                            onChange={(event) => handleFilterSelect(event.target.value)}
                            label="Select Operation"
                        >
                            {filterOptions.map((option) => (
                                <MuiMenuItem key={option} value={option}>
                                    {option}
                                </MuiMenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </MenuItem>
                
                {/* Value Field */}
                <MenuItem sx={{gap:2}}>
                    <TextField
                            disabled={filterParams.operation === "" || filterParams.operation === "is empty"}
                            label={`Filter ${filterParams.column}`}
                            value={filterParams.value}
                            onChange={handleFilterValueChange}
                        />
                    <Button sx={{color:"white", backgroundColor:"#1565c0"}} onClick={handleFilterApply}>Apply Filter</Button>
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
