import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { useRouter } from "next/navigation";
import { headers } from 'next/dist/client/components/headers';

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

function StockTable(): JSX.Element {
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const [user_id, setUserId] = useState('');

  const config = {
    headers: {
      'Content-Type': 'application/json', // Set the appropriate content type
      // 'Access-Control-Allow-Origin': 'http://localhost:3000', // Your allowed origin
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('jwt_token');
      if(!token) {
        console.log("no token found, routing to sign in page");
        router.push('/signIn');
      } else {
        const user_id = jwt.decode(token).user_id;
        console.log(user_id);
        setUserId(user_id);
        axios.options('http://127.0.0.1:5328/get_portfolio_table', null, config).then( async (response) => {
          const res = await axios.post('http://127.0.0.1:5328/get_portfolio_table', {user_id: user_id}, config);
          console.log(res.data);
          setTableData(res.data.data);
        }

        )
        .catch(error => {
          // Handle errors from the OPTIONS request
          console.error('OPTIONS Request Error:', error);
        });
      }
    }
    fetchData();

  }, []);

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
          pageSize={5}
        />
      </Box>
    </div>
  );
}

export default StockTable;
