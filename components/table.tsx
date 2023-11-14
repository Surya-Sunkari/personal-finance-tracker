import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useRouter } from "next/navigation";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 130 },
  {
    field: 'name',
    headerName: 'Name',
    width: 175,
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 175,
  },
  {
    field: 'cost',
    headerName: 'Cost',
    width: 175,
    sortComparator: (a, b) => parseFloat(a) - parseFloat(b),
    valueFormatter: (params) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(params.value),
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 175,
    sortComparator: (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    valueFormatter: (params) =>
      new Intl.DateTimeFormat('en-US').format(new Date(params.value)),
  },
];

function PowerTable( {tableData}: {tableData: any} ): JSX.Element {
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

export default PowerTable;
