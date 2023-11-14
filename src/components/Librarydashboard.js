import React, { useState, useEffect } from 'react';
//import Web3 from 'web3';
import LibraryJSON from '../Library.json';
import '../bookcard.css';
import Navbar from './navconnection';
function Librarydashboard() {
    const booksData = [
        {
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            yearOfPublish: 1925,
        },
        {   id:0,
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            yearOfPublish: 1960,
        },
        {    id:1,
            title: "1984",
            author: "George Orwell",
            yearOfPublish: 1949,
        },
        {    id:2,
            title: "Pride and Prejudice",
            author: "Jane Austen",
            yearOfPublish: 1813,
        },
        {    id:3,
            title: "The Hobbit",
            author: "J.R.R. Tolkien",
            yearOfPublish: 1937,
        },
        {    id:4,
            title: "The Catcher in the Rye",
            author: "J.D. Salinger",
            yearOfPublish: 1951,
        },
    ];
    // you need to input the books at time of deployment by owner only
    
    
    
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [formattedBooks, setformattedbooks] = useState([]);
  const fetchAvailableBooks = async () => {
    try {
      const ethers = require("ethers");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(LibraryJSON.address, LibraryJSON.abi, signer);
      
      // Call the contract function to get available books.
      const bookIds = await contract.getAvailableBooks();
  
      // Fetch book details for each book ID.
      const booksData = await Promise.all(
        bookIds.map(async (bookId) => {
          console.log('book id',bookId.toNumber());
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
      setAvailableBooks(booksData);
    } catch (error) {
      console.error('Error fetching available books:', error);
      // Handle the error or set an empty array if needed.
      // setAvailableBooks([]);
    }
  };
  
  useEffect(() => {
    // Fetch available books when the component mounts.
    fetchAvailableBooks();
  }, []);
  
// new


// // Replace this with your handleBorrow function to handle book borrowing.



//     setformattedbooks(formattedBooks);
  async function handleBorrow(id) {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
     let contract = new ethers.Contract(LibraryJSON.address, LibraryJSON.abi, signer)
    // //create an NFT Token
     await contract.borrowBook(id);

     console.log('book sucessfully borrowed');
   
};

  return (
    <div className="App" >
      <Navbar/>
      <div className="text-3xl available-book-card">Available Books <br /><br/></div>
      <div style={{display:'flex'}}>
       <ul style={{display:'flex',margin:'5px'}}> 
        {availableBooks.map((book,key) => (
          
            <div  className="book-card" key={key}>
            <h2 className="book-title" style={{color:'black'}}>Title:{book.title}</h2>
            <p className="book-author">Author:{book.author}</p>
            <p className="book-year">status: {book.borrowed ? 'Not available' : 'Available'}</p>
            <p>book id:{book.id}</p>
            <button style={{backgroundColor:'red',color:'white'}} onClick={() => handleBorrow(book.id)}>Borrow</button>
        </div>
       
        ))}
      </ul> 
      </div>
      





    </div>
  );
}

export default Librarydashboard;
