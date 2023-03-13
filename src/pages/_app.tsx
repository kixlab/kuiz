import { GlobalDialog } from '@components/GlobalDialog'
import { Gnb } from '@components/Gnb'
import { Global } from '@emotion/react'
import styled from '@emotion/styled'
import { store } from '@redux/store'
import { ResetStyles } from '@styles/resetStyle'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { MOBILE_WIDTH_THRESHOLD } from 'src/constants/ui'
import { GlobalStyles } from 'src/styles/globalStyle'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <SessionProvider session={pageProps.session}>
        <Global styles={GlobalStyles} />
        <Global styles={ResetStyles} />
        <Gnb />
        <Content>
          <Component {...pageProps} />
        </Content>
        <GlobalDialog />
      </SessionProvider>
    </Provider>
  )
}

const Content = styled.div`
  padding-top: 40px;
  padding-bottom: 60px;
  max-width: 800px;
  margin: 0 auto;
  @media (max-width: ${MOBILE_WIDTH_THRESHOLD}px) {
    margin: 16px auto 16px auto;
    max-width: calc(100% - 16px);
    padding: 0;
  }
`
