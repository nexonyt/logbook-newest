import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './screens/Login';
import { RegisterPage } from './screens/Register';
import { Logged } from './screens/Looged';
import PrivateRoutes from './utils/PrivateRoutes';
import Main from './pages/Main';

export function Router() {
  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path='/logged' element={<Logged />} />
      </Route>
      <Route path='/' element={<LoginPage />} exact />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/dashboard' element={<Main />} />
    </Routes>
  );
}