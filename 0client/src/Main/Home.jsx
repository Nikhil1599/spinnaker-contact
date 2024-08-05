import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-blue-500 text-white p-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">
              Welcome to Contact Manager
            </h1>
            <p className="text-lg mb-4">
              Effortlessly manage your contacts and stay organized.
            </p>
            <Link
              to="/signup"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg text-lg font-semibold"
            >
              Get Started
            </Link>
          </div>
          <div className="mt-8 md:mt-0">
            <img
              src="https://via.placeholder.com/400x300" // Replace with your image URL
              alt="Contact Management"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="p-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Organize Contacts</h3>
              <p>
                Easily add, edit, and manage your contacts with our intuitive
                interface.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Search & Filter</h3>
              <p>
                Quickly find and filter contacts using our powerful search
                functionality.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                Global Contact Lookup
              </h3>
              <p>
                Check if your contacts are in our global database and identify
                spam risks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-500 text-white p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-4">
          Join thousands of users who are organizing their contacts
          effortlessly.
        </p>
        <Link
          to="/signup"
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg text-lg font-semibold"
        >
          Sign Up Now
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
