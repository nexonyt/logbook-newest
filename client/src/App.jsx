import { BrowserRouter } from 'react-router-dom';
import { Router } from './Routes';
import { ToastContainer } from 'react-toastify';
import axios from "axios";
import Navbar from './components/Navbar';

//axios.defaults.baseURL = "https://api.nexonstudio.pl";
axios.defaults.baseURL = "http://localhost:4040";
axios.defaults.withCredentials = false;

export function App() {
  return (
    <BrowserRouter>
      <Router />
      <ToastContainer />
    </BrowserRouter>
  );
}