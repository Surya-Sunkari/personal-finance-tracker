"use client";
import React, { useEffect, useState } from "react";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

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

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSubmit = async () => {
        console.log(expenseName, expenseCost, expenseDate);
        console.log("submit");
    };

    return (
        <div>
            <Button variant='contained' onClick={handleOpen}>Manually Add Expense</Button>
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
                            <Button variant='contained' onClick={handleSubmit}>Submit</Button>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
  );
};

export default AddExpense;
