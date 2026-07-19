import { BrowserRouter } from 'react-router-dom';
import { Router } from './Routes';
import { ToastContainer } from 'react-toastify';
import axios from "axios";

axios.defaults.baseURL = "https://31.70.91.202:4040";
//axios.defaults.baseURL = "http://localhost:4040";
axios.defaults.withCredentials = false;

export function App() {
  return (
    <BrowserRouter>
      <Router />
      <ToastContainer position="bottom-right" theme="dark" closeOnClick={false} pauseOnFocusLoss={false}
      />
    </BrowserRouter>
  );
}