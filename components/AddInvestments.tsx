import React, { useEffect, useState } from "react";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useRouter } from "next/navigation";
import jwt from 'jsonwebtoken';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
};

const AddInvestments = () => {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState('');

  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if(!token) {
      console.log("no token found, routing to sign in page");
      router.push('/signIn');
    } else {
      const user_id = jwt.decode(token).user_id;
      console.log(user_id);
      setUserId(user_id);
    }
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    const selectedFile = event.target.csvFile.files[0]; // Access the file via event.target
    formData.append('file', selectedFile);
    formData.append('user_id', userId);
    for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await axios.post('http://127.0.0.1:5328/new_stocks', formData, config);

      if (response.status === 200) {
        if (response.data.success) {
          console.log('Investments added');
          handleClose();
          toast.success('Investment added!', {
            position: toast.POSITION.TOP_CENTER,
          });
        } else {
          console.error('Investment Adding Failed', response.data);
        }
      } else {
        toast.error('Error!', {
          position: toast.POSITION.TOP_CENTER,
        });
        console.error('Error:', response.data);
      }
    } catch (error) {
      toast.error('Error!', {
        position: toast.POSITION.TOP_CENTER,
      });
      console.error('Network/Request Error:', error);
    }
  };

  return (
    <div>
      <ToastContainer />
      <Button variant="contained" onClick={handleOpen} className="bg-blue-700 hover:bg-blue-800 w-64">
        Add Investments From CSV
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            onClick: (e) => e.stopPropagation(),
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <h1 className="text-2xl text-black font-bold pb-4">Add Investments From CSV</h1>
            <p className="pb-8 text-red-500 ">CSV Format: ticker | quantity | date | time</p>
            <form encType="multipart/form-data" onSubmit={handleSubmit}>
              <label className="block">
                <span className="sr-only">Choose CSV</span>
                <input
                  id="csvFile"
                  type="file"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-500 file:text-white
                    hover:file:bg-blue-600"
                  accept=".csv"
                  name="csvFile" // Add a name attribute
                />
              </label>
              <div className="pt-6 flex justify-center items-center">
                <Button variant="contained" color="success" className="bg-green-800" type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default AddInvestments;

