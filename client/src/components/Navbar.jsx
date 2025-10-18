import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <h2 className="text-lg font-semibold cursor-pointer" onClick={() => navigate("/tools")}>
          🧰 Tool Library
        </h2>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>

        <div className={`md:flex gap-5 items-center ${open ? "block" : "hidden"} md:block`}>
          {user ? (
            <>
              <Link to="/tools" className="hover:text-gray-200">Tools</Link>
              <Link to="/reservations" className="hover:text-gray-200">Reservations</Link>
              <Link to="/reviews" className="hover:text-gray-200">Reviews</Link>
              <Link to="/reports" className="hover:text-gray-200">Reports</Link>
              {user.role === "admin" && <Link to="/admin" className="hover:text-gray-200">Admin</Link>}
              <button onClick={handleLogout} className="bg-white text-primary px-3 py-1 rounded hover:bg-gray-100">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-200">Login</Link>
              <Link to="/register" className="hover:text-gray-200">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
