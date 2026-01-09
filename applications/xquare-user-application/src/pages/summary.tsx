import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { Summary } from "@xquare/user-interfaces";
import {
  useAuthGuard,
  useMultipleDeploymentSummaries,
  useTeams,
  useTeamApplications,
} from "@xquare/hooks";
import { getSelectedTeamId } from "@xquare/utils";
import { useMemo } from "react";

const SummaryPage = () => {
  useAuthGuard();

  useEffect(() => {
    document.title = "XQUARE | Summary";
  }, []);

  const { data: teams } = useTeams();

  const selectedTeamId = useMemo(() => {
    const storedTeamId = getSelectedTeamId();
    if (!storedTeamId || !teams) return undefined;
    const foundTeam = teams.find((team) => team.id === storedTeamId);
    return foundTeam?.id;
  }, [teams]);

  const { data: applications } = useTeamApplications(selectedTeamId);

  const applicationIds = useMemo(() => {
    if (!applications || applications.length === 0) return undefined;
    return applications.map((app) => app.id);
  }, [applications]);

  const { data: deploymentData, loading: deploymentLoading } =
    useMultipleDeploymentSummaries(applicationIds);

  return (
    <Container>
      <Helmet>
        <title>XQUARE | Summary</title>
      </Helmet>
      <Summary
        page={3}
        deploymentData={deploymentData}
        deploymentLoading={deploymentLoading}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  padding: 10px 40px;
  cursor: default;
`;

export default SummaryPage;
