import styled from 'styled-components';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { ButtonLink,DashboardContent } from '../styles';

const MainDiv = styled.div`
    background-color: white;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100vh;

`

const Main = () => {

    const { logout } = useAuth();

    const handleLogout = () => {
      logout();
      toast.warn('You have been logged out');
    };
  

    return (
        <MainDiv>
            <Navbar></Navbar>
            <DashboardContent>
            <h1>Witamy w Logbooku!</h1>
            <h1>Witamy w Logbooku!</h1>
            <h1>Witamy w Logbooku!</h1>
            <h1>Witamy w Logbooku!</h1>
            <h1>Witamy w Logbooku!</h1>
            <h1>Witamy w Logbooku!</h1>
            <h1>Witamy w Logbooku!</h1>
            <h1>Witamy w Logbooku!</h1>
            <h1>Witamy w Logbooku!</h1>
            <h1>Witamy w Logbooku!</h1>
            <h1>Witamy w Logbooku!</h1>
            <h1>Witamy w Logbooku!</h1>
            <h1>Witamy w Logbooku!</h1>
            <h1>Witamy w Logbooku!</h1>ś
            </DashboardContent>
        </MainDiv>
    )
};

export default Main;

