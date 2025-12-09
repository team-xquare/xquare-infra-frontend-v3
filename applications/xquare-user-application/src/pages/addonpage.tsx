import styled from "@emotion/styled";
import {
  Title,
  Xquare_colors,
  Button_round,
  AddonItem,
} from "@xquare/user-interfaces";

function AddonPage() {
  const handleAddAddonClick = () => {
    // TODO: Addon 추가하기 클릭 시 동작 구현
  };
  const displayItems = [
    {
      title: "Redis Addon",
      domain: "redis.xquare.dev",
      type: "pod",
      description: "Redis service for caching and management.",
      traffic: 10,
      health: 3,
      lastdeploy: "2024.06.01",
      lastbuild: "2024.06.01",
      charge: "Test User",
    },
    {
      title: "Redis Addon",
      domain: "redis.xquare.dev",
      type: "pod",
      description: "Redis service for caching and management.",
      traffic: 10,
      health: 1,
      lastdeploy: "2024.06.01",
      lastbuild: "2024.06.01",
      charge: "Test User",
    },
    {
      title: "Redis Addon",
      domain: "redis.xquare.dev",
      type: "pod",
      description: "Redis service for caching and management.",
      traffic: 10,
      health: 2,
      lastdeploy: "2024.06.01",
      lastbuild: "2024.06.01",
      charge: "Test User",
    },
  ];
  return (
    <Container>
      <ContentsArea>
        <Title
          title={`Addons`}
          subTitle={"Deploy addons via xquare infra"}
        ></Title>
        <Button_round width="170px" onClick={handleAddAddonClick}>
          Addons 추가하기
        </Button_round>
      </ContentsArea>
      <Addons>
        {displayItems.map((item, index) => (
          <AddonItem
            key={`addon-${index}`}
            title={item.title}
            domain={item.domain}
            type={item.type}
            description={item.description}
            traffic={Number(item.traffic)}
            health={Number(item.health)}
            lastdeploy={item.lastdeploy}
            lastbuild={item.lastbuild}
            charge={item.charge}
          />
        ))}
      </Addons>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  padding: 10px 40px;
`;

const ContentsArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 2px solid ${Xquare_colors.gray[300]};
  width: 100%;
  margin-bottom: 20px;
`;

const Addons = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(370px, 1fr));
  grid-auto-rows: auto;
  width: 100%;
  row-gap: 20px;
`;

export default AddonPage;
