const library =  require("../src/Library.json");
async function getNFts () {
const MyContract = await ethers.getContractFactory("Library");
const contract = await MyContract.attach(
  library.address
);

// Now you can call functions of the contract
var vals = await contract.getListPrice();
console.log(vals);

// this code is to only for testing purposes you may test the any function by calling it directly
}

getNFts();
// this code 


