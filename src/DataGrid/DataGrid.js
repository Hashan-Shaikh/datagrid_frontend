import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import { GrFormView } from "react-icons/gr";
import { MdOutlineDelete } from "react-icons/md";
import { Button, ButtonGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 


const CarDataGrid = () => {
    const [rowData, setRowData] = useState([]);
    const [colHeaders, setColHeaders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [columnDefs, setColumnDefs] = useState([{}]);

    const navigate = useNavigate();

    useEffect(() => {
        if (searchTerm) {
            axios.get(`http://localhost:3000/dynamic/search?searchTerm=${searchTerm}`)
                .then((response) => {
                    //setColHeaders(response.data.headers)
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
        console.log(searchId)
        navigate(`/details/${searchId}`);
    }

    const handleDelete = (searchId) => {
        console.log(searchId)
    }

    const Action = {
        headerName: "Actions", 
        cellRenderer: (params) => (
            <ButtonGroup variant="contained" aria-label="action buttons">
                <Button 
                    onClick={() => handleView(params.data._id)} 
                    startIcon={<GrFormView />}
                >
                    
                </Button>
                <Button 
                    onClick={() => handleDelete(params.data._id)} 
                    startIcon={<MdOutlineDelete />}
                >
                    
                </Button>
            </ButtonGroup>
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
