import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import { GrFormView } from "react-icons/gr";
import { MdOutlineDelete } from "react-icons/md";
import { Button, ButtonGroup } from '@mui/material'; 


const CarDataGrid = () => {
    const [rowData, setRowData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (searchTerm) {
            axios.get(`http://localhost:3000/cars/search?searchTerm=${searchTerm}`)
                .then(response => setRowData(response.data))
                .catch(error => console.error(error));
        } else {
            // Fetch all data when there is no search term
            axios.get('http://localhost:3000/cars')
                .then((response) => setRowData(response.data))
                .catch(error => console.error(error));
        }
    }, [searchTerm]);

    const onSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleView = (searchId) => {
        console.log(searchId)
    }

    const handleDelete = (searchId) => {
        console.log(searchId)
    }

    const columnDefs = [
        { headerName: "Brand", field: "Brand" },
        { headerName: "Model", field: "Model" },
        { headerName: "Price", field: "PriceEuro" },
        {
            headerName: "Actions", 
            cellRenderer: (params) => (
                <ButtonGroup variant="contained" aria-label="action buttons">
                    <Button 
                        onClick={() => handleView(params.data._id)} 
                        startIcon={<GrFormView />}
                    >
                        View
                    </Button>
                    <Button 
                        onClick={() => handleDelete(params.data._id)} 
                        startIcon={<MdOutlineDelete />}
                    >
                        Delete
                    </Button>
                </ButtonGroup>
            ),
        },
    ];

    return (
        <div>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={onSearchChange}
            />
            <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData}
                    pagination={true}
                    domLayout='autoHeight'
                />
            </div>
        </div>
    );
};

export default CarDataGrid;
