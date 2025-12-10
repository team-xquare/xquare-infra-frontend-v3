import React from "react";
import styled from "@emotion/styled";
import { useState, useCallback } from "react";
import {
  Title,
  Xquare_colors,
  NavItem,
  Button_round,
  SummaryContents,
  DeploymentContents,
  SecretContents,
  RoutesContents,
  LogContents,
} from "@xquare/user-interfaces";

const DeploymentView = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [editable, setEditable] = useState(false);
  const id = 0;
  const servicename = "service-name";
  const servicedesc = "service-description";

  const handleSave = useCallback(() => {
    setEditable(false);
  }, []);

  const tabContents = [
    <SummaryContents key="summary" />,
    <DeploymentContents
      key={`deployment-${editable ? "edit" : "readonly"}`}
      id={id}
      editable={editable}
      onSave={handleSave}
    />,
    <SecretContents
      key={`secret-${editable ? "edit" : "readonly"}`}
      id={id}
      editable={editable}
      onSave={handleSave}
    />,
    <RoutesContents
      key={`routes-${editable ? "edit" : "readonly"}`}
      id={id}
      editable={editable}
      onSave={handleSave}
    />,
    <LogContents key="log" />,
  ];

  const handleTabClick = useCallback((index: number) => {
    setActiveTab(index);
    setEditable(false);
  }, []);

  const handleeditClick = useCallback(() => {
    if (editable) {
      setEditable(false);
    } else {
      setEditable(true);
    }
  }, [editable]);

  return (
    <Container>
      <ContentsArea>
        <Title title={`${servicename}`} subTitle={`${servicedesc}`}></Title>
      </ContentsArea>
      <ButtonArea>
        <NavBar>
          {["Summary", "Deployment", "Secret", "Routes", "Log"].map(
            (label, index) => (
              <NavItem
                children={label}
                onClick={() => handleTabClick(index)}
                active={activeTab === index}
              />
            ),
          )}
        </NavBar>
        <Button_round
          children={editable ? "취소하기" : "수정하기"}
          onClick={handleeditClick}
        />
      </ButtonArea>
      <Contents>{tabContents[activeTab]}</Contents>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  padding: 10px 40px;
`;

const ContentsArea = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  padding-bottom: 10px;
  width: 100%;
  margin-bottom: 15px;
  gap: 15px;
`;

const ButtonArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
`;

const NavBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 35px;
  background-color: ${Xquare_colors.white};
  border-radius: 12px;
  gap: 10px;
  border: 2px solid ${Xquare_colors.gray[500]};
`;

const Contents = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
  margin-top: 20px;
`;

export default React.memo(DeploymentView);
