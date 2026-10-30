import React from "react";
import MainPage from "./states/MainPage";
import { DatesProvider } from "./context/DatesContext";
import { InteractiveProvider } from "./context/InteractiveContext";
import { UserProvider } from "./context/UserContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ModalProvider } from "./context/ContextHooks/ModalContext";

const App = () => {
  return (
    <UserProvider>
        <DatesProvider>
          <InteractiveProvider>
            <ModalProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<MainPage />}>
                    <Route path="event" element={null} />
                    <Route path="reminder" element={null} />
                    <Route path="notifications" element={null} />
                  </Route>
                </Routes>
              </Router>
            </ModalProvider>
          </InteractiveProvider>
        </DatesProvider>
    </UserProvider>
  );
};

export default React.memo(App);
