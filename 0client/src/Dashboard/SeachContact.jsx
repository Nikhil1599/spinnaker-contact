import { useState } from "react";
import axios from "axios";

const SearchContact = () => {
  const [phone, setPhone] = useState("");
  const [contact, setContact] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      setError("");
      const response = await axios.get(
        `http://localhost:5000/api/search?phone=${phone}`
      ); // Full URL
      console.log("Response data:", response.data);
      setContact(response.data);
    } catch (err) {
      console.error(
        "Error fetching contact details:",
        err.response ? err.response.data : err.message
      );
      setError("Error fetching contact details. Check console for details.");
    }
  };

  return (
    <div className="p-6 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Search Global Contact
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full max-w-md">
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
          className="p-2 border border-gray-300 rounded-md mb-4 w-full"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
        >
          Search
        </button>

        {error && <p className="mt-4 text-red-500">{error}</p>}

        {contact && (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-2 text-gray-700">
              Contact Details
            </h2>
            <p>
              <span className="font-semibold">Name:</span> {contact.name}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {contact.phone}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {contact.email}
            </p>
            <p>
              <span className="font-semibold">City:</span> {contact.city}
            </p>
            <p>
              <span className="font-semibold">Country:</span> {contact.country}
            </p>
            <p>
              <span className="font-semibold">Spam Likelihood:</span>{" "}
              {contact.spam_likelihood}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchContact;
