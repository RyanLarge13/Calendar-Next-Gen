import React from "react";
import MainPage from "./states/MainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/newevent" element={<MainPage />} />
        <Route path="/newreminder" element={<MainPage />} />
      </Routes>
    </Router>
  );
};

export default React.memo(App);
