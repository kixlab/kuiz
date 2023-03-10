import { css } from '@emotion/react'
import { MOBILE_WIDTH_THRESHOLD } from 'src/constants/ui'

export const palette = {
  common: {
    black: '#000000',
    white: '#ffffff',
    transparent: 'rgba(0,0,0,0)',
  },
  primary: {
    main: '#3d8add',
    light: '#C6DAED',
    dark: '#346191',
  },
  background: {
    main: '#e6eaef',
    light: '#EEF2F6',
    dark: '#C4CFDD',
  },
  tags: {
    answer: '#0F9C50',
    distractor: '#CF3434',
    contrastText: '#ffffff',
  },
  grey: {
    100: '#121212',
    200: '#323232',
    300: '#616161',
    400: '#919191',
    500: '#bdbdbd',
    600: '#f1f1f1',
  },
}

export const typography = {
  logo: css`
    font-family: 'raleway';
    font-size: 20px;
    color: ${palette.primary.main};
    @media (max-width: ${MOBILE_WIDTH_THRESHOLD}px) {
      font-size: 18px;
    }
  `,
  hStem: css`
    font-family: 'inter-sb';
    font-size: 18px;
    color: ${palette.grey[100]};
    @media (max-width: ${MOBILE_WIDTH_THRESHOLD}px) {
      font-size: 16px;
    }
  `,
  hLabel: css`
    font-family: 'inter-sb';
    font-size: 17px;
    @media (max-width: ${MOBILE_WIDTH_THRESHOLD}px) {
      font-size: 15px;
    }
  `,
  b01: css`
    font-family: 'inter-r';
    font-size: 16px;
    @media (max-width: ${MOBILE_WIDTH_THRESHOLD}px) {
      font-size: 14px;
    }
  `,
  b02: css`
    font-family: 'inter-r';
    font-size: 15px;
    @media (max-width: ${MOBILE_WIDTH_THRESHOLD}px) {
      font-size: 14px;
    }
  `,
  b02b: css`
    font-family: 'inter-m';
    font-size: 15px;
    @media (max-width: ${MOBILE_WIDTH_THRESHOLD}px) {
      font-size: 14px;
    }
  `,
  b03: css`
    font-family: 'inter-r';
    font-size: 14px;
    @media (max-width: ${MOBILE_WIDTH_THRESHOLD}px) {
      font-size: 13px;
    }
  `,
  b03b: css`
    font-family: 'inter-m';
    font-size: 14px;
    @media (max-width: ${MOBILE_WIDTH_THRESHOLD}px) {
      font-size: 14px;
    }
  `,
  button: css`
    font-family: 'inter-m';
    font-size: 14px;
    @media (max-width: ${MOBILE_WIDTH_THRESHOLD}px) {
      font-size: 14px;
    }
  `,
  smallbutton: css`
    font-family: 'inter-m';
    font-size: 12px;
    @media (max-width: ${MOBILE_WIDTH_THRESHOLD}px) {
      font-size: 14px;
    }
  `,
  overline: css`
    font-family: 'inter-r';
    font-size: 12px;
    @media (max-width: ${MOBILE_WIDTH_THRESHOLD}px) {
      font-size: 11px;
    }
  `,
}
