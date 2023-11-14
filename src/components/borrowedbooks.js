import React, { useState, useEffect } from 'react';
//import Web3 from 'web3';
import LibraryManagementContract from '../Library.json';
import '../bookcard.css';

import Navbar from './navconnection';

export default function Profile () {
    const [data, updateData] = useState([]);
   

    async function getborrowed() {
        const ethers = require("ethers");
        let sumPrice = 0;
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();

        //Pull the deployed contract instance
        let contract = new ethers.Contract(LibraryManagementContract.address, LibraryManagementContract.abi, signer)
        // updating the part to fetch bid amount
        
      
        let borrowedbooks = await contract.getBorrowedBooks();
        console.log(borrowedbooks);
        const booksData = await Promise.all(
          borrowedbooks.map(async (bookId) => {
            console.log(bookId.toNumber());
            const bookInfo = await contract.getBookDetails(bookId.toNumber());
    
            return {
              id:bookId.toNumber(),
              title: bookInfo[0],
              author: bookInfo[1],
              borrowed: bookInfo[3],
            };
          })
        );
    
        // Update the state with all available books.
       // setAvailableBooks(booksData);

        updateData(booksData);
        
        }
        async function handlereturn(id) {
            const ethers = require("ethers");
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            //Pull the deployed contract instance
             let contract = new ethers.Contract(LibraryManagementContract.address, LibraryManagementContract.abi, signer)
            // //create an NFT Token
             await contract.returnBook(id);
             console.log('book returned borrowed');
           
        };

        

        useEffect(() => {
          // Fetch available books when the component mounts.
          getborrowed();
        }, []);
//getborrowed();


        return (
            <div>
              <Navbar/>
              <h2 className='text-3xl'>Your Borrowed Books</h2>
              <br/><br/>
              <ul style={{display:'flex',margin:'5px'}}>
                {data.map((book, index) => (
                    <>
                   <div class="book-card" key={index}>
                   <h2 class="book-title">{book.title}</h2>
                   <p class="book-author">Author:{book.author}</p>
                   <p class="book-year">borrowed</p>
                   {/* //<button style={{backgroundColor:'red',color:'white'}} onClick={ handleBorrow(book.id)}>Borrow</button> */}
                   <button style={{backgroundColor:'red',color:'white'}} onClick={()=> handlereturn(book.id)}>return</button>
               </div>
              

                  <div className="mt-10 text-xl">
                  {data.length == 0 ? "Oops, No books to display (Are you logged in?)":""}
              </div>
              </>
                ))}
              </ul>
            </div>
          );
        
    }