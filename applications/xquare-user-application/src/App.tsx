import { Routes, Route } from "react-router-dom";
import { Global } from "@emotion/react";
import globalStyles from "./styles/global";

import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";

function App() {
  return (
    <>
      <Global styles={globalStyles} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </>
  );
}

export default App;
