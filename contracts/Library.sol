// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LibraryManagement {
    address public owner;
    uint256 public bookCount;

    struct Book {
        uint256 id; // New ID field
        string title;
        string author;
        uint256 yearOfPublish;
        uint256 borrowDate;
        uint256 returnDate;
        bool isBorrowed;
    }

    mapping(uint256 => Book) public books;
    mapping(address => uint256[]) public userBorrowedBooks;
    mapping(address => uint256) public userBalance; // User's account balance.

    constructor() {
        owner = msg.sender;
        addBook(1,"Mastering Bitcoin", " Andreas M. Antonopoulos", 2014);
        addBook(2,"Blockchain Basics", " Daniel Drescher", 2017);
        addBook(3,"Blockchain Revolution", "Don Tapscott", 2016);
        addBook(4,"The Basics of Bitcoins ", " Antony Lewis", 2018);
        addBook(5,"Blockchain Applications", " Antony Lewis", 2018);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
function getUserBill() public view returns (uint256) {
        return userBalance[msg.sender];
    }
    function addBook(uint256 _bookId, string memory _title, string memory _author, uint256 _yearOfPublish) public onlyOwner {
        require(books[_bookId].borrowDate == 0, "Book with this ID already exists.");
        books[_bookId] = Book(_bookId, _title, _author, _yearOfPublish, 0, 0, false);
        bookCount++;
    }

    function borrowBook(uint256 _bookId) public {
        require(books[_bookId].borrowDate == 0, "Book is already borrowed.");
        books[_bookId].borrowDate = block.timestamp;
        books[_bookId].isBorrowed = true;
        userBorrowedBooks[msg.sender].push(_bookId); // Add the book to the user's borrowed books.
    }

    function returnBook(uint256 _bookId) public {
       // require(books[_bookId].isBorrowed, "Book is not borrowed.");
        uint256 borrowDate = books[_bookId].borrowDate;
        books[_bookId].borrowDate = borrowDate;
        books[_bookId].isBorrowed = false;
        books[_bookId].returnDate = block.timestamp;
        removeBorrowedBook(msg.sender, _bookId); // Remove the book from the user's borrowed books.
        uint256 bill = calculateBill(_bookId);
        userBalance[msg.sender] += bill; // Update the user's balance.
    }

    function calculateBill(uint256 _bookId) public view returns (uint256) {
        //require(books[_bookId].isBorrowed, "Book is not borrowed.");
        uint256 borrowDate = books[_bookId].borrowDate;
        uint256 returnDate = books[_bookId].returnDate == 0 ? block.timestamp : books[_bookId].returnDate;
        // You can define your own billing logic here, e.g., charge per day.
        uint256 bill = (returnDate - borrowDate) * 1 wei; // 1 wei per second
        return bill;
    }

    function getBorrowedBooks() public view returns (uint256[] memory) {
        return userBorrowedBooks[msg.sender];
    }

    function getAvailableBooks() public view returns (uint256[] memory) {
        uint256[] memory availableBooks = new uint256[](bookCount);
        uint256 count = 0;
        for (uint256 i = 1; i <= bookCount; i++) {
            if (!books[i].isBorrowed) {
                availableBooks[count] = i;
                count++;
            }
        }
        assembly {
            mstore(availableBooks, count)
        }
        return availableBooks;
    }
    function getBookDetails(uint256 _bookId) public view returns (string memory, string memory, uint256, bool) {
    require(_bookId > 0 && _bookId <= bookCount, "Invalid book ID");
    
    Book memory book = books[_bookId];
    
    return (book.title, book.author, book.yearOfPublish, book.isBorrowed);
}
    function removeBorrowedBook(address user, uint256 _bookId) internal {
        uint256[] storage borrowedBooks = userBorrowedBooks[user];
        for (uint256 i = 0; i < borrowedBooks.length; i++) {
            if (borrowedBooks[i] == _bookId) {
                borrowedBooks[i] = borrowedBooks[borrowedBooks.length - 1];
                borrowedBooks.pop();
                break;
            }
        }
    }

    function payBill() public payable {
        uint256 userBill = userBalance[msg.sender];
        require(userBill > 0, "No outstanding bill to pay.");
        require(address(this).balance >= userBill, "Library's balance is insufficient for the payment.");
        userBalance[msg.sender] = 0;
        payable(owner).transfer(userBill); // Transfer the bill amount to the library owner.
    }

    receive() external payable {}
}
