import { Routes, Route } from "react-router-dom";
import { Global } from "@emotion/react";
import globalStyles from "./styles/global";

import Layout from "./layout";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import HomePage from "./pages/home";
import NoticePage from "./pages/noticepage";
import FeedPage from "./pages/feedpage";
import MonitorPage from "./pages/monitor";
import NoticeView from "./pages/noticeview";
import FeedView from "./pages/feedview";
import AddonPage from "./pages/addonpage";
import DeploymentHome from "./pages/deploymenthome";
import DeploymentView from "./pages/deploymentview";

const art = `
                                                              
  ##     ##  #######  ##     ##    ###    ########  ########  
   ##   ##  ##     ## ##     ##   ## ##   ##     ## ##        
    ## ##   ##     ## ##     ##  ##   ##  ##     ## ##        
     ###    ##     ## ##     ## ##     ## ########  #######   
    ## ##   ##  ## ## ##     ## ######### ##   ##   ##        
   ##   ##  ##    ##  ##     ## ##     ## ##    ##  ##        
  ##     ##  ##### ##  #######  ##     ## ##     ## ########  
                                                              
`;

function App() {
  console.log(art);
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

        <Route
          path="/deployment"
          element={
            <Layout>
              <DeploymentHome />
            </Layout>
          }
        />

        <Route
          path="/deployment/view/:id"
          element={
            <Layout>
              <DeploymentView />
            </Layout>
          }
        />

        <Route
          path="/addons"
          element={
            <Layout>
              <AddonPage />
            </Layout>
          }
        />

        <Route
          path="/monitor"
          element={
            <Layout>
              <MonitorPage />
            </Layout>
          }
        />

        <Route
          path="/notice"
          element={
            <Layout>
              <NoticePage />
            </Layout>
          }
        />

        <Route
          path="/feed"
          element={
            <Layout>
              <FeedPage />
            </Layout>
          }
        />

        <Route
          path="/notice/view/:id"
          element={
            <Layout>
              <NoticeView />
            </Layout>
          }
        />

        <Route
          path="/feed/view/:id"
          element={
            <Layout>
              <FeedView />
            </Layout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
