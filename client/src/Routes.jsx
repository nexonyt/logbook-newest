import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './screens/Login';
import { RegisterPage } from './screens/Register';
import { Logged } from './screens/Looged';
import Main from './pages/Main';
import PrivateRoutes from './utils/PrivateRoutes';
import Flights from './pages/Flights';

export function Router() {
  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path='/dashboard' element={<Main />} />
        <Route path='/nexonyt' element={<Main />} />
        <Route path='/flights' element={<Flights />} />
      </Route>
      <Route path='/' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
    </Routes>
  );
}