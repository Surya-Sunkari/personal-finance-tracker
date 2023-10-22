// "use client";
// import React, { useEffect, useState } from 'react';
// import Box from '@mui/material/Box';
// import { DataGrid, GridColDef, GridFilterOperator, GridFilterItem, GridCellParams, GridFilterInputValueProps } from '@mui/x-data-grid';

// const costComparator = (a, b) => { 
//   return parseFloat(a.replace(/[$,]/g, '')) >= parseFloat(b.replace(/[$,]/g, ''));
// }

// const dateComparator = (a, b) => {
//   const dateA = new Date(a);
//   const dateB = new Date(b);

//   if (dateA < dateB) {
//     return -1; // a comes before b
//   } else if (dateA > dateB) {
//     return 1; // a comes after b
//   } else {
//     return 0; // a and b are equal
//   }
// }


// let columns: GridColDef[] = [
//   { field: 'id', headerName: 'ID', width: 130 },
//   {
//     field: 'name',
//     headerName: 'Name',
//     width: 230,
//   },
//   {
//     field: 'category',
//     headerName: 'Category',
//     width: 230,
//   },
//   {
//     field: 'cost',
//     headerName: 'Cost',
//     width: 230,
//     sortComparator: costComparator,
//   },
//   {
//     field: 'date',
//     headerName: 'Date',
//     width: 230,
//     sortComparator: dateComparator,
//   },
// ];

// const sampleData = [
//   {
//     name: 'Netflix',
//     cost: 10.52,
//     category: 'Entertainment',
//     date: 'Fri, 11 Aug 2023 00:00:00 GMT',
//     id: 1
// },
// {
//   name: 'Groceries',
//   cost: 70.81,
//   category: 'Food',
//   date: 'Fri, 12 Aug 2023 00:00:00 GMT',
//   id: 2
// },
// {
//   name: 'Electricity Bill',
//   cost: 50.23,
//   category: 'Utilities',
//   date: 'Fri, 13 Aug 2023 00:00:00 GMT',
//   id: 3
// },
// {
//   name: 'Chipotle',
//   cost: 10.23,
//   category: 'Food',
//   date: 'Fri, 11 Aug 2023 00:00:00 GMT',
//   id: 4
// },
// {
//   name: 'Rent',
//   cost: 150.23,
//   category: 'Housing',
//   date: 'Fri, 10 Aug 2023 00:00:00 GMT',
//   id: 5
// },
// ];

// export default function powerTable() : JSX.Element{
//   const [tableData, setTableData] = useState<any>([]);

//   useEffect(() => {
//     setTableData(getTableData(sampleData));
//   }, []); 

//   const formatDate = (value) => {
//     return value.toLocaleDateString('en-US', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//     });
//   };

//   const formatCurrency = (value) => {
//     return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
//   };
  
//   const getTableData = (data) => {
//     return [...(data || [])].map((d) => {
//         d.date = formatDate(new Date(Date.parse(d.date)));
//         d.cost = formatCurrency(d.cost);
  
//         return d;
//     });
//   };

//   return (
//     <div
//       style={{
//         display: 'flex',
//         justifyContent: 'center', // Center horizontally
//         alignItems: 'center', // Center vertically
//         height: '100vh', // Set a fixed height if necessary
//       }}
//     >
//      <Box sx={{ height: 400, width: '80%' }}>
//       <DataGrid
//         rows={tableData}
//         columns={columns}
//         initialState={{
//           pagination: {
//             paginationModel: {
//               pageSize: 5,
//             },
//           },
//         }}
//         pageSizeOptions={[5]}
//         disableRowSelectionOnClick
//       />
//     </Box>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 130 },
  {
    field: 'name',
    headerName: 'Name',
    width: 230,
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 230,
  },
  {
    field: 'cost',
    headerName: 'Cost',
    width: 230,
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
    width: 230,
    sortComparator: (a, b) => new Date(a) - new Date(b),
    valueFormatter: (params) =>
      new Intl.DateTimeFormat('en-US').format(new Date(params.value)),
  },
];

const sampleData = [
    {
      name: 'Netflix',
      cost: 10.52,
      category: 'Entertainment',
      date: 'Fri, 11 Aug 2023 00:00:00 GMT',
      id: 1
  },
  {
    name: 'Groceries',
    cost: 70.81,
    category: 'Food',
    date: 'Fri, 12 Aug 2023 00:00:00 GMT',
    id: 2
  },
  {
    name: 'Electricity Bill',
    cost: 50.23,
    category: 'Utilities',
    date: 'Fri, 13 Aug 2023 00:00:00 GMT',
    id: 3
  },
  {
    name: 'Chipotle',
    cost: 10.23,
    category: 'Food',
    date: 'Fri, 11 Aug 2023 00:00:00 GMT',
    id: 4
  },
  {
    name: 'Rent',
    cost: 150.23,
    category: 'Housing',
    date: 'Fri, 10 Aug 2023 00:00:00 GMT',
    id: 5
  },
  ];

function PowerTable(): JSX.Element {
  const [tableData, setTableData] = useState(sampleData);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Box sx={{ height: 400, width: '80%' }}>
        <DataGrid
          rows={tableData}
          columns={columns}
          paginationMode="server"
          pageSize={5}
        />
      </Box>
    </div>
  );
}

export default PowerTable;
