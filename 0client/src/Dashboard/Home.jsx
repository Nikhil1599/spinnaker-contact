import Sidebar from "./Sidebar";
import MainContent from "./MainContent";

const Home = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64" />
      <div className="flex-1 p-4">
        {" "}
        {/* Takes remaining space */}
        <MainContent />
      </div>
    </div>
  );
};

export default Home;
