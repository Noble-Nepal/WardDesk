import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Registration from "./pages/auth/Registration";
import Home from "./pages/Home";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
