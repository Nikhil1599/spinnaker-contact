import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Import profile icon from react-icons
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token exists in local storage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    setIsLoggedIn(false);
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Brand */}
        <div className="text-white text-xl font-bold">
          <Link to="/">LMS Console</Link>
        </div>

        {/* Navbar Links */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <FaUserCircle className="text-xl text-white mr-2" />
              <button
                onClick={handleLogout}
                className="text-white hover:bg-blue-700 px-3 py-2 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:bg-blue-700 px-3 py-2 rounded-md"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-white hover:bg-blue-700 px-3 py-2 rounded-md"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
