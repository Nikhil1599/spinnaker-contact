import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-gray-800 text-white shadow-lg border border-gray-700">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <ul>
          <li className="mb-4">
            <Link
              to="/user/dashboard"
              className={`block p-4 rounded-md ${
                location.pathname === "/user/dashboard"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/user/profile"
              className={`block p-4 rounded-md ${
                location.pathname === "/user/profile"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              Profile
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/user/contacts"
              className={`block p-4 rounded-md ${
                location.pathname === "/user/contacts"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              My Contacts
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/user/contacts/search"
              className={`block p-4 rounded-md ${
                location.pathname === "/user/contacts/search"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              Search Contact
            </Link>
          </li>
          {/* Add more links here as needed */}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
