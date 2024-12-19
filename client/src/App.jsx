import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import LocomotiveScroll from 'locomotive-scroll';
import Dispthreenav from "./pages/Dispthreenav";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CSGO from "./pages/csgo";
import MusicPage from "./pages/Music";

export default function App() {  
  const locomotiveScroll = new LocomotiveScroll();

  return <BrowserRouter>
  <Header />
    <Routes> 
      <Route path="/" element={<Home />} />
    < Route path="/sign-up" element={<SignUp />} />
    <Route path="/sign-in" element={<SignIn />} /> 
    <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
        </Route>
    <Route path="/threenav" element={<Dispthreenav />} />
    <Route path='/csgo' element={<CSGO />} />
    <Route path='/music' element={<MusicPage />} />
    

    
  </Routes>

  </BrowserRouter>;
  
}
