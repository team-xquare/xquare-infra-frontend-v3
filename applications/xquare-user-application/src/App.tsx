import { Routes, Route } from "react-router-dom";
import { Global } from "@emotion/react";
import LoginPage from "./pages/login";
import globalStyles from "./styles/global";

function App() {
  return (
    <>
      <Global styles={globalStyles} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
