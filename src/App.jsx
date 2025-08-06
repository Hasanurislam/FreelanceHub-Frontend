import { Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./Component/Header";
import Navbar from "./Component/Navbar";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import SignUp from "./Pages/SignUp";
import Gigs from "./Pages/Gigs";
import AddGig from "./Pages/AddGigs";
import GigDetails from "./Pages/GigDetails";
import MyGigs from "./Component/MyGigs";
import Order from "./Pages/Order";
import Messages from "./Pages/Messages"; // Corrected Path
import Message from "./Pages/Message";   // Corrected Path
import Contact from "./Pages/Contact";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Checkout from "./Pages/Checkout";
import BecomeSeller from "./Pages/BecomeSeller"; 
import About from "./Pages/About";
import Earnings from "./Pages/Earnings";

const stripePromise = loadStripe("pk_test_51Rrc7lKmrOuTLPbt92l7z3rn5UIuK3G2mgcw1N7OYWvwB9H2CSX7H2xMVeboVuFQjbLbcL6XWFxy0BXKUdgzNJaq00reeTu9rG"); // use your Stripe public key here

function App() {
  return (
    <Elements stripe={stripePromise}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/gigs" element={<Gigs />} />
        <Route path="/add" element={<AddGig />} />
        <Route path="/mygigs" element={<MyGigs />} />
        <Route path="/gig/:id" element={<GigDetails />} />
        <Route path="/orders" element={<Order />} />
        {/* Add the routes for your messaging pages */}
        <Route path="/messages" element={<Messages />} />
       <Route path="/message/:id" element={<Message />} />
        <Route path="/pay/:id" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/become-seller" element={<BecomeSeller />} />
        <Route path="/aboutus" element={<About/>} />
        <Route path="/earnings" element={<Earnings />} />
      </Routes>
    </Elements>
  );
}

export default App;