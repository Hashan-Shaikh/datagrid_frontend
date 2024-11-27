import React from 'react'
import { AgGridReact } from 'ag-grid-react';

const DataTable = ({columnDefs, rowData}) => {
  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
            columnDefs={columnDefs}
            rowData={rowData}
            pagination={true}
            domLayout='autoHeight'
        />
    </div>
  )
}

export default DataTable