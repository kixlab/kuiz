import { css } from '@emotion/react'
import { MOBILE_WIDTH_THRESHOLD } from 'src/constants/ui'

export const GlobalStyles = css`
  @font-face {
    font-family: 'raleway';
    src: url('/Raleway-ExtraBold.ttf');
  }
  @font-face {
    font-family: 'inter-r';
    src: url('/Inter-Regular.ttf');
  }
  @font-face {
    font-family: 'inter-m';
    src: url('/Inter-Medium.ttf');
  }
  @font-face {
    font-family: 'inter-sb';
    src: url('/Inter-SemiBold.ttf');
  }
  body {
    background-color: #e6eaef;
  }
  @media (max-width: ${MOBILE_WIDTH_THRESHOLD}px) {
    body {
      flex-direction: column;
    }
    .Box {
      width: calc(100vw - 40px);
      margin: 0 20px 0 20px;
      top: 50px;
    }
  }
`
