import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL, token } from "../../config";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 4; // Number of contacts per page

  // Function to fetch user details
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Function to fetch contacts
  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    // Fetch data whenever the component is rendered
    fetchUserDetails();
    fetchContacts();
  }, [currentPage]); // Dependency array with currentPage if you want to refetch when page changes

  // Calculate paginated contacts
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total pages
  const totalPages = Math.ceil(contacts.length / contactsPerPage);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Dashboard</h1>

      {/* User Details Section */}
      {user && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            User Details
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Name:</span> {user.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {user.phone}
            </p>
            <p>
              <span className="font-semibold">City:</span> {user.city}
            </p>
            <p>
              <span className="font-semibold">Country:</span> {user.country}
            </p>
          </div>
        </div>
      )}

      {/* Contacts Table */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Contacts</h2>
        {currentContacts.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200 border-b">
                <th className="p-3 text-left text-gray-600">Name</th>
                <th className="p-3 text-left text-gray-600">Phone</th>
              </tr>
            </thead>
            <tbody>
              {currentContacts.map((contact, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3 text-gray-700">{contact.name}</td>
                  <td className="p-3 text-gray-700">{contact.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No contacts found.</p>
        )}

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-center">
          <ul className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index + 1}>
                <button
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
