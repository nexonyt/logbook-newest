import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./screens/Login";
import { RegisterPage } from "./screens/Register";
import { Logged } from "./screens/Looged";
import MyProfile from "./screens/MyProfile";
import Main from "./pages/Main";
import PrivateRoutes from "./utils/PrivateRoutes";
import Flights from "./pages/Flights";
import AddFlights from "./pages/AddFlight";
import Stats from "./screens/Stats";

export function Router() {
  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path="/dashboard" element={<Main />} />
        <Route path="/nexonyt" element={<Main />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/add-flight" element={<AddFlights />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/my-profile" element={<MyProfile />} />
      </Route>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
