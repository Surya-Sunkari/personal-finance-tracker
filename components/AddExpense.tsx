"use client";
import React, { useEffect, useState } from "react";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useRouter } from "next/navigation";
import axios from 'axios';
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
  

const AddExpense = () => {

    const [open, setOpen] = useState(false);
    const [expenseName, setExpenseName] = useState('');
    const [expenseCost, setExpenseCost] = useState('');
    const [expenseDate, setExpenseDate] = useState('');
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
    const handleSubmit = async () => {
        try {
            const user_data = {
                user_id: userId,
                name: expenseName,
                cost: parseInt(expenseCost),
                date: expenseDate,
            };
        
            const response = await axios.post('http://127.0.0.1:5328/new_expense', user_data);
        
            if (response.status === 200) {
                if(response.data.success) {
                    console.log("expense added");
                    setExpenseCost('');
                    setExpenseDate('');
                    setExpenseName('');
                    handleClose();
                    toast.success("Expense added!", {
                        position: toast.POSITION.TOP_CENTER
                    });
                } else {
                    console.error('Expense Adding Failed', response.data); 
                }
            } else {
                toast.error("Error!", {
                    position: toast.POSITION.TOP_CENTER
                });
                console.error('Error:', response.data);
            }
        } catch (error) {
            toast.error("Error!", {
                position: toast.POSITION.TOP_CENTER
            });
            console.error('Network/Request Error:', error);
        }
    };

    return (
        <div>
            <ToastContainer />
            <Button variant="contained" onClick={handleOpen} className="bg-green-700	 hover:bg-green-800 w-60">Manually Add Expense</Button>
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
                    onClick: (e) => e.stopPropagation()
                },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <h1 className=' text-2xl text-black font-bold pb-4'>Add Expense</h1>
                        <div className=' py-3'>
                            <label className="block text-sm font-medium mb-2 dark:text-white">Expense Name: </label>
                            <input type="text" id="input-label" className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Rent" value={expenseName} onChange={(e) => setExpenseName(e.target.value)}></input>
                        </div>
                        <div className=' py-3'>
                            <label className="block text-sm font-medium mb-2 dark:text-white">Expense Cost ($): </label>
                            <input type="text" id="input-label" className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500" placeholder="1199.00" value={expenseCost} onChange={(e) => setExpenseCost(e.target.value)}></input>
                        </div>
                        <div className=' py-3'>
                            <label className="block text-sm font-medium mb-2 dark:text-white">Expense Date (yyyy-mm-dd): </label>
                            <input type="text" id="input-label" className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500" placeholder="2023-10-21" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)}></input>
                        </div>
                        <div className='pt-3 flex justify-center items-center'>
                            <Button variant='contained' color="success" className="bg-green-800"  onClick={handleSubmit}>Submit</Button>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
  );
};

export default AddExpense;
