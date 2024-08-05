import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL, token } from "../../config";

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({ name: "", phone: "" });
  const [newContactForm, setNewContactForm] = useState({ name: "", phone: "" });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/contacts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContacts(response.data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  const handleMarkSpam = async (contactId) => {
    try {
      await axios.post(
        `${BASE_URL}/contacts/mark_spam/${contactId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh contacts list after marking as spam
      const response = await axios.get(`${BASE_URL}/user/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContacts(response.data);
    } catch (error) {
      console.error("Error marking contact as spam:", error);
    }
  };

  const handleDelete = async (contactId) => {
    try {
      await axios.delete(`${BASE_URL}/contacts/${contactId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh contacts list after deletion
      const response = await axios.get(`${BASE_URL}/user/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContacts(response.data);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${BASE_URL}/contacts/${selectedContact.id}`,
        updateForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh contacts list after update
      const response = await axios.get(`${BASE_URL}/user/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContacts(response.data);
      setShowUpdateModal(false);
      setSelectedContact(null);
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const handleAddContact = async () => {
    try {
      await axios.post(`${BASE_URL}/add_contact`, newContactForm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh contacts list after adding new contact
      const response = await axios.get(`${BASE_URL}/user/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContacts(response.data);
      setShowAddModal(false);
      setNewContactForm({ name: "", phone: "" });
    } catch (error) {
      console.error("Error adding new contact:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm({ ...updateForm, [name]: value });
  };

  const handleNewContactChange = (e) => {
    const { name, value } = e.target;
    setNewContactForm({ ...newContactForm, [name]: value });
  };

  const openUpdateModal = (contact) => {
    setSelectedContact(contact);
    setUpdateForm({ name: contact.name, phone: contact.phone });
    setShowUpdateModal(true);
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">My Contacts</h1>
      <button
        onClick={() => setShowAddModal(true)}
        className="px-4 py-2 bg-green-500 text-white rounded-lg mb-4"
      >
        Add New Contact
      </button>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        {contacts.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200 border-b">
                <th className="p-3 text-left text-gray-600">Name</th>
                <th className="p-3 text-left text-gray-600">Phone</th>
                <th className="p-3 text-left text-gray-600">Spam Status</th>
                <th className="p-3 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} className="border-b">
                  <td className="p-3 text-gray-700">{contact.name}</td>
                  <td className="p-3 text-gray-700">{contact.phone}</td>
                  <td className="p-3 text-gray-700">{contact.spam_status}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleMarkSpam(contact.id)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg mr-2"
                    >
                      Mark Spam
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg mr-2"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => openUpdateModal(contact)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No contacts found.</p>
        )}
      </div>

      {/* Update Contact Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Update Contact
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={updateForm.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={updateForm.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Add New Contact
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddContact();
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newContactForm.name}
                  onChange={handleNewContactChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={newContactForm.phone}
                  onChange={handleNewContactChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsPage;
