import React from "react";
import MainPage from "./states/MainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />}>
          <Route path="/newevent" element={null} />
          <Route path="/newreminder" element={null} />
        </Route>
      </Routes>
    </Router>
  );
};

export default React.memo(App);
