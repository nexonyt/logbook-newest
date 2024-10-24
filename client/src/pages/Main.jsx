import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { ButtonLink } from '../styles';
const MainDiv = styled.div`
    background-color: white;
    display: flex;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
`

const Main = () => {

    const { logout } = useAuth();

    const handleLogout = () => {
      logout();
      toast.warn('You have been logged out');
    };
  

    return (
        <MainDiv>
            <h1>Witamy w Logbooku!</h1>
            <ButtonLink to='/' onClick={handleLogout}>Logout</ButtonLink>
        </MainDiv>
    )
};

export default Main;

