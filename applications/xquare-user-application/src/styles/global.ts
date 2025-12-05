import { css } from "@emotion/react";

export const globalStyles = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  figure,
  dl,
  dd,
  ul,
  ol,
  li,
  fieldset,
  legend,
  input,
  textarea,
  button {
    margin: 0;
    padding: 0;
  }

  html,
  body,
  #root {
    height: 100%;
  }
`;

export default globalStyles;
