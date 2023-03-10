import { PropsWithChildren } from 'react'
import styled from '@emotion/styled'
import { MOBILE_WIDTH_THRESHOLD } from 'src/constants/ui'

export const Modal = ({ children }: PropsWithChildren) => {
  return (
    <ModalContainer>
      <DialogBox>{children}</DialogBox>
      <Backdrop />
    </ModalContainer>
  )
}

const ModalContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  z-index: 20;
  @media (max-width: ${MOBILE_WIDTH_THRESHOLD}px) {
    align-items: center;
  }
`

const DialogBox = styled.div`
  width: 500px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: space-between;
  padding: 30px 40px;
  margin: auto;
  border-radius: 8px;
  box-sizing: border-box;
  background-color: white;
  z-index: 21;
  @media (max-width: ${MOBILE_WIDTH_THRESHOLD}px) {
    width: 100%;
    height: auto;
    gap: 12px;
    margin: 0 20px 0 20px;
  }
`

const Backdrop = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.4);
`
