import { Routes, Route } from "react-router-dom";
import Courses from "./pages/courses/Courses";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/profile/Profile";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Courses />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <h1 className="text-4xl font-bold text-red-600">🔥 Tailwind funcionando!</h1>
    </>
  );
}

export default App;