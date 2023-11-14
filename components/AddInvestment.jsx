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
    position: 'absolute',
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
  

const AddInvestment = () => {

    const [open, setOpen] = useState(false);
    const [TickerName, setTickerName] = useState('');
    const [InvestmentDate, setInvestmentDate] = useState('');
    const [InvestmentTime, setInvestmentTime] = useState('');
    const [InvestmentQuantity, setInvestmentQuantity] = useState(0);
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
                ticker: TickerName,
                date: InvestmentDate,
                time: InvestmentTime,
                quantity: InvestmentQuantity
            };
        
            const response = await axios.post('http://127.0.0.1:5328/new_stock', user_data);
        
            if (response.status === 200) {
                if(response.data.success) {
                    console.log("investment added"); // TODO: add toast
                    setTickerName('');
                    setInvestmentTime('');
                    setInvestmentDate('');
                    setInvestmentQuantity(0);
                    handleClose();
                    toast.success("Investment added!", {
                        position: toast.POSITION.TOP_CENTER
                    });
                } else {
                    console.error('Investment Adding Failed', response.data); 
                }
            } else {
                toast.error("Error!", {
                    position: toast.POSITION.TOP_CENTER
                });
                console.error('Error:', response.data);
            }
        } catch (error) {
            toast.success("Error!", {
                position: toast.POSITION.TOP_CENTER
            });
            console.error('Network/Request Error:', error);
        }
    };

    return (
        <div>
            <ToastContainer />
            <Button variant="contained" onClick={handleOpen} className="bg-blue-700 hover:bg-blue-800 w-64">Manually Add Investment</Button>
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
                },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <h1 className=' text-2xl text-black font-bold pb-4'>Add Investment</h1>
                        <div className=' py-3'>
                            <label className="block text-sm font-medium mb-2 dark:text-white">Ticker Name: </label>
                            <input type="text" id="input-label" className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500" placeholder="AAPL" value={TickerName} onChange={(e) => setTickerName(e.target.value)}></input>
                        </div>
                        <div className=' py-3'>
                            <label className="block text-sm font-medium mb-2 dark:text-white">Investment Date (yyyy-mm-dd): </label>
                            <input type="text" id="input-label" className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500" placeholder="2023-10-21" value={InvestmentDate} onChange={(e) => setInvestmentDate(e.target.value)}></input>
                        </div>
                        <div className=' py-3'>
                            <label className="block text-sm font-medium mb-2 dark:text-white">Investment Time (hh:mm): </label>
                            <input type="text" id="input-label" className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500" placeholder="08:37" value={InvestmentTime} onChange={(e) => setInvestmentTime(e.target.value)}></input>
                        </div>
                        <div className=' py-3'>
                            <label className="block text-sm font-medium mb-2 dark:text-white">Investment Quantity (shares): </label>
                            <input type="number" id="input-label" className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500" placeholder="15" value={InvestmentQuantity} onChange={(e) => setInvestmentQuantity(parseInt(e.target.value))}></input>
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

export default AddInvestment;



