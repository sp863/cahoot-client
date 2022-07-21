import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
export const GlobalStyles = createGlobalStyle`
    ${reset}
    :root {
      --button-font-color: #212529;
      --primary-color: #212529;
      --font-color: #212529;
      --hover-color: #868e96;
    }

    a{
        text-decoration: none;
        color: inherit;
    }

    *{
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    html {
      width: 100%;
      height: 100%;
    }

    body {
        color: var(--font-color);
        width: 100%;
        height: 100%;
        font-family: "Montserrat", sans-serif;
    }

    #root {
      width: 100%;
      height: 100%;
    }
`;
