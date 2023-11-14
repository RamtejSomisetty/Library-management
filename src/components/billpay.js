import React, { useState, useEffect } from 'react';
import LibraryManagementContract from '../Library.json';
import Navbar from './navconnection';
function BillManagement() {
  const [unpaidAmount, setUnpaidAmount] = useState(0);
  const [amountToPay, setAmountToPay] = useState(0);

  // Replace with your contract ABI and address
  
  const payBill = async () => {
    try {
     
        const ethers = require("ethers");
        
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();

        //Pull the deployed contract instance
        let contract = new ethers.Contract(LibraryManagementContract.address, LibraryManagementContract.abi, signer)
      // Get the user's unpaid bill
      const userBill = await contract.getUserBill(); // Replace with your contract function
     // let bill = ethers.utils.formatUnits(userBill, 'ether');
     //let bill = ethers.utils.parseUnits(userBill, 'wei');
     const userBillString = ethers.utils.parseUnits(userBill.toString(), 'wei').toString();

    // bill=bill.toString();
    //   bill=bill.toNumber();
      // Ensure there's an unpaid bill
      if (userBill > 0) {
        // Send a transaction to pay the bill
        const tx = await contract.payBill({ value: userBillString }); // Replace with your contract function

        // Wait for the transaction to be mined
        await tx.wait();
        
        // Update the unpaid amount
        setUnpaidAmount(0);
      } else {
        console.error('No outstanding bill to pay.');
      }
    } catch (error) {
      console.error('Error paying the bill:', error);
    }
  };

  const getUnpaidAmount = async () => {
    try {
        const ethers = require("ethers");
        let sumPrice = 0;
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();

        //Pull the deployed contract instance
        let contract = new ethers.Contract(LibraryManagementContract.address, LibraryManagementContract.abi, signer)

      // Get the user's unpaid bill
      const userBill = await contract.getUserBill(); // Replace with your contract function
      let bill = ethers.utils.formatUnits(userBill.toString(), 'ether');
      setUnpaidAmount(bill);
    } catch (error) {
      console.error('Error getting unpaid amount:', error);
    }
  };

  useEffect(() => {
    // Get the user's unpaid bill when the component mounts
    getUnpaidAmount();
  }, []);

  return (
    <div>
        <Navbar/>
        <div style={{fontSize:'30px'}}>
      <h2>Bill Management</h2>
      <p>Unpaid Amount: {unpaidAmount} ETH</p>
      <button  style={{backgroundColor:'black',color:'white',borderRadius:'5px',position:'relative',top:'40px',left:'70px'}} onClick={payBill}>Pay Bill</button>
      </div>
    </div>
  );
}

export default BillManagement;
