import { Modal } from './Modal'
import styled from '@emotion/styled'
import { FillBtn, StrokeBtn } from '../basic/button/Button'
import { Label } from '../basic/Label'

interface Props {
  title: string
  message: string
  modalState: boolean
  btnName: string
  toggleModal: () => void
}

export const CheckDialog = ({ title, message, modalState, btnName, toggleModal }: Props) => {
  if (modalState) {
    return (
      <Modal>
        <Label color="black" size={1}>
          {title}
        </Label>
        <div>{message}</div>
        <BtnRow>
          <FillBtn onClick={toggleModal}>{btnName}</FillBtn>
          <StrokeBtn onClick={toggleModal}>Cancel</StrokeBtn>
        </BtnRow>
      </Modal>
    )
  } else return null
}

const BtnRow = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  gap: 12px;
`
