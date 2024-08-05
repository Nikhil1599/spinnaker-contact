// src/components/MainContent.jsx
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import MyContacts from "./MyContact";
import Profile from "./Profile";
import SearchContact from "./SeachContact";

const MainContent = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/contacts" element={<MyContacts />} />
      <Route path="/contacts/search" element={<SearchContact />} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default MainContent;
