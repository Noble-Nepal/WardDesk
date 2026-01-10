import { Route, Routes } from "react-router-dom";
import Registration from "./pages/Registration";
import Login from "./pages/login";
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
