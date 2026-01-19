import { Routes, Route } from "react-router-dom";
import { Global } from "@emotion/react";
import globalStyles from "./styles/global";

import Layout from "./layout";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import HomePage from "./pages/home";
import NoticePage from "./pages/noticepage";
// import FeedPage from "./pages/feedpage";
import SummaryPage from "./pages/summary";
import NoticeView from "./pages/noticeview";
// import FeedView from "./pages/feedview";
import AddonPage from "./pages/addonpage";
import DeploymentHome from "./pages/deploymenthome";
import DeploymentView from "./pages/deploymentview";
import CreateApplication from "./pages/createapplication";
import CreateAddon from "./pages/createaddon";
import AddonDetailPage from "./pages/addondetail";
import TeamPage from "./pages/team";
import GithubCallback from "./pages/githubcallback";
import NotFound from "./pages/Pagenotfound";

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
        <Route path="/github/callback" element={<GithubCallback />} />

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
          path="/deployment/createapplication"
          element={
            <Layout>
              <CreateApplication />
            </Layout>
          }
        />

        <Route
          path="/addons/createaddon"
          element={
            <Layout>
              <CreateAddon />
            </Layout>
          }
        />

        <Route
          path="/addons/:addonId"
          element={
            <Layout>
              <AddonDetailPage />
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
          path="/summary"
          element={
            <Layout>
              <SummaryPage />
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

        {/* <Route
          path="/feed"
          element={
            <Layout>
              <FeedPage />
            </Layout>
          }
        /> */}

        <Route
          path="/notice/view/:id"
          element={
            <Layout>
              <NoticeView />
            </Layout>
          }
        />

        <Route
          path="/team"
          element={
            <Layout>
              <TeamPage />
            </Layout>
          }
        />

        {/* <Route
          path="/feed/view/:id"
          element={
            <Layout>
              <FeedView />
            </Layout>
          }
        /> */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
