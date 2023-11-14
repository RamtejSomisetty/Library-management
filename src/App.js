import './App.css';
//import Navbar from './components/Navbar.js';
import Librarydashboard from './components/Librarydashboard';
// import Profile from './components/Profile';
// import SellNFT from './components/SellNFT';
// import NFTPage from './components/NFTpage';
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Profile from './components/borrowedbooks';

function App() {
  return (
    <div className="container">
        <Routes>
          <Route path="/" element={<Librarydashboard />}/>
          <Route path="/borrowed" element={<Profile/>}/>
          {/* <Route path="/nftPage" element={<NFTPage />}/>        
          <Route path="/profile" element={<Profile />}/>
          <Route path="/sellNFT" element={<SellNFT />}/>              */}
        </Routes>
    </div>
  );
}

export default App;
