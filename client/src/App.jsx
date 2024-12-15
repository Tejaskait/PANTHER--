import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import LocomotiveScroll from 'locomotive-scroll';
import Dispthreenav from "./pages/Dispthreenav";

export default function App() {  
  const locomotiveScroll = new LocomotiveScroll();

  return <BrowserRouter>
    <Routes> 
      <Route path="/" element={<Home />} />
    < Route path="/sign-up" element={<SignUp />} />
    <Route path="/sign-in" element={<SignIn />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/threenav" element={<Dispthreenav />} />

    
  </Routes>

  </BrowserRouter>;
  
}
