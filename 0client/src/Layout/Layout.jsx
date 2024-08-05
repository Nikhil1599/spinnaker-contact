import Footer from "../Main/Footer";
import Navbar from "../Main/Navbar";
import Routers from "../Routes/Routes";

const Layout = () => {
  return (
    <div>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routers />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
