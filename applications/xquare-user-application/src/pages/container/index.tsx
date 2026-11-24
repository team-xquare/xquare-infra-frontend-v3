import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthGuard } from "@xquare/hooks";
import { Xquare_colors } from "@xquare/user-interfaces";
import ContainerList from "./ContainerList";
import SummaryTab from "./SummaryTab";
import { mockContainers } from "./mock";

const TABS = [
  { id: "summary", label: "Summary", ready: true },
  { id: "resource", label: "Resource", ready: false },
  { id: "disk", label: "Disk", ready: false },
  { id: "console", label: "Console", ready: false },
] as const;

type TabId = (typeof TABS)[number]["id"];

function ContainerPage() {
  useAuthGuard();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("summary");
  const [selectedId, setSelectedId] = useState(mockContainers[0]?.id);

  useEffect(() => {
    document.title = "XQUARE | Container";
  }, []);

  const selected = mockContainers.find((ct) => ct.id === selectedId);

  return (
    <Wrapper>
      <PageHeader>
        <PageTitle>PVE CONTAINER</PageTitle>
        <PageDescription>
          Proxmox 컨테이너(CT)의 상태와 리소스 사용 현황을 한눈에 확인하세요.
        </PageDescription>
      </PageHeader>

      <TabNavigation>
        <Tabs role="tablist">
          {TABS.map((tab) => (
            <Tab
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              $active={activeTab === tab.id}
              disabled={!tab.ready}
              title={tab.ready ? undefined : "준비 중입니다"}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Tab>
          ))}
        </Tabs>
        <CreateButton
          type="button"
          onClick={() => navigate("/container/create")}
        >
          CT/VM 생성
        </CreateButton>
      </TabNavigation>

      <Management>
        <ContainerList
          containers={mockContainers}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        {selected && activeTab === "summary" && (
          <SummaryTab container={selected} />
        )}
      </Management>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  min-width: 0;
  padding: 40px;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  line-height: 1.2;
  color: ${Xquare_colors.black as string};
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 500;
`;

const PageDescription = styled.p`
  font-size: 16px;
`;

const TabNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Tabs = styled.div`
  display: flex;
  gap: 5px;
  padding: 1px;
  border: 1px solid ${Xquare_colors.gray[500] as string};
  border-radius: 10px;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 8px 20px;
  line-height: 1.2;
  border-radius: 10px;
  border: 1px solid
    ${({ $active }) =>
      ($active ? Xquare_colors.purple[500] : "transparent") as string};
  background-color: ${({ $active }) =>
    ($active ? Xquare_colors.purple[100] : Xquare_colors.white) as string};
  font-size: 16px;
  font-weight: 600;
  color: ${({ $active }) =>
    ($active ? Xquare_colors.purple[500] : Xquare_colors.gray[500]) as string};
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
`;

const CreateButton = styled.button`
  padding: 10px 30px;
  border-radius: 20px;
  border: 1px solid ${Xquare_colors.gray[400] as string};
  background-color: ${Xquare_colors.white as string};
  font-size: 16px;
  line-height: 1.2;
  color: ${Xquare_colors.gray[400] as string};
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    border-color: ${Xquare_colors.purple[500] as string};
    color: ${Xquare_colors.purple[500] as string};
  }
`;

const Management = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
`;

export default ContainerPage;
