const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await deployer.getBalance();
  console.log(balance);
  const librarymanagement = await hre.ethers.getContractFactory("LibraryManagement");
  const library = await librarymanagement.deploy();

  await library.deployed();

  const data = {
    address: library.address,
    abi: JSON.parse(library.interface.format('json'))
  }

  //This writes the ABI and address to the mktplace.json
  fs.writeFileSync('./src/Library.json', JSON.stringify(data))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
