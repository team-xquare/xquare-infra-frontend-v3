import styled from "@emotion/styled";
import { Xquare_colors } from "@xquare/user-interfaces";

export const Container = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100vw;
  background-color: ${Xquare_colors.white};
  cursor: default;

  @media (max-width: 650px) {
    flex-direction: column;
  }
`;

export const Left = styled.div`
  display: flex;
  flex: 1 1 65%;
  background-color: ${Xquare_colors.purple[400]};
  box-shadow: inset -4px 0 10px rgba(0, 0, 0, 0.35);
  align-items: center;
  justify-content: center;

  @media (max-width: 650px) {
    width: 100%;
    padding: 0.7rem 0;
    max-height: 30vh;
  }
`;

export const LogoImg = styled.img`
  width: 55%;
  height: auto;
  max-width: 360px;

  @media (max-width: 650px) {
    width: 43%;
    max-height: 28vh;
  }
`;

export const Right = styled.div`
  display: flex;
  flex: 1 1 35%;
  margin-top: 15vh;
  flex-direction: column;
  align-items: center;

  @media (max-width: 650px) {
    margin-top: 7vh;
  }
`;

export const FormCard = styled.form`
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-items: center;
`;

export const Inputs = styled.div`
  width: 100%;
  min-height: 8.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  align-items: center;
  margin-bottom: 6rem;

  &.fade-in {
    opacity: 1;
    transform: translateY(0);
    transition:
      opacity 0.18s ease,
      transform 0.18s ease;
  }

  &.fade-out {
    opacity: 0;
    transform: translateY(10px);
    transition:
      opacity 0.18s ease,
      transform 0.18s ease;
  }

  @media (max-width: 650px) {
    margin-bottom: 3rem;
  }
`;

export const FormActions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  align-items: center;
`;

export const RevealInput = styled.div`
  width: fit-content;
  max-width: 100%;
  animation: reveal 0.22s ease;

  @keyframes reveal {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const LinkRow = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;

  a {
    display: flex;
    height: 1.8rem;
    align-items: center;
    justify-content: center;
  }
`;
