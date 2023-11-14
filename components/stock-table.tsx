import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useRouter } from "next/navigation";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 130 },
  {
    field: 'ticker',
    headerName: 'Ticker',
    width: 175,
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    width: 175,
    sortComparator: (a, b) => parseInt(a) - parseInt(b),
  },
  {
    field: 'price',
    headerName: 'Price',
    width: 175,
    sortComparator: (a, b) => parseFloat(a) - parseFloat(b),
    valueFormatter: (params) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(params.value),
  },
  {
    field: 'value',
    headerName: 'Value',
    width: 175,
    sortComparator: (a, b) => parseInt(a) - parseInt(b),
    valueFormatter: (params) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(params.value),
  },
];

function StockTable( {tableData}: {tableData: any} ): JSX.Element {
  const router = useRouter();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '45vh',
        marginTop: '20px'
      }}
    >
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={tableData}
          columns={columns}
          paginationMode="server"
        />
      </Box>
    </div>
  );
}

export default StockTable;
