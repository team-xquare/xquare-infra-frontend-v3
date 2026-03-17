import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Global } from "@emotion/react";
import globalStyles from "./styles/Global.styles";

import ViewSizeWarning from "./pages/ViewSizeWarning";
import Layout from "./layout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import NoticePage from "./pages/NoticePage";
// import FeedPage from "./pages/FeedPage";
import SummaryPage from "./pages/SummaryPage";
import NoticeView from "./pages/NoticeView";
// import FeedView from "./pages/FeedView";
import AddonPage from "./pages/AddonPage";
import DeploymentHome from "./pages/DeploymentHome";
import DeploymentView from "./pages/DeploymentView";
import CreateApplication from "./pages/CreateApplication";
import CreateAddon from "./pages/CreateAddon";
import AddonDetailPage from "./pages/AddonDetailPage";
import TeamPage from "./pages/TeamPage";
import GithubCallback from "./pages/GithubCallback";
import GithubSetupComplete from "./pages/GithubSetupComplete";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

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
  const [isBlocked, setIsBlocked] = useState(false);

  console.log(art);

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 1100) setIsBlocked(true);
      else if (window.innerHeight < 720) setIsBlocked(true);
      else setIsBlocked(false);
    };

    // 초기 체크
    checkScreenSize();

    // 창 크기 변경 시 체크
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (isBlocked) {
    return (
      <>
        <Global styles={globalStyles} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/github/callback" element={<GithubCallback />} />

          <Route
            path="/github/setup-complete"
            element={<GithubSetupComplete />}
          />

          <Route path="*" element={<ViewSizeWarning />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <Global styles={globalStyles} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/github/callback" element={<GithubCallback />} />

        <Route
          path="/github/setup-complete"
          element={<GithubSetupComplete />}
        />

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

        <Route path="/about" element={<About />} />

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
