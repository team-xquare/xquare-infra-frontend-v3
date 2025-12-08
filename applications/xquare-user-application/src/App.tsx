import { Routes, Route } from "react-router-dom";
import { Global } from "@emotion/react";
import globalStyles from "./styles/global";

import Layout from "./layout";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import HomePage from "./pages/home";

function App() {
  return (
    <>
      <Global styles={globalStyles} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
