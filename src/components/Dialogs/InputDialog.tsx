import styled from '@emotion/styled'
import { typography, palette } from '@styles/theme'
import { useState } from 'react'
import { FillBtn, StrokeBtn } from '../basic/button/Button'
import { Label } from '../basic/Label'
import { Modal } from './Modal'

interface Props {
  modalState: boolean
  submit: (msg: string) => void
  toggleModal: () => string //Empty message return
}

export const InputDialog = (props: Props) => {
  const [inputMsg, setInputMsg] = useState('')
  if (props.modalState) {
    return (
      <Modal>
        <Label color="black" size={1}>
          Report Error
        </Label>
        <TextAreaInput onChange={e => setInputMsg(e.target.value)} placeholder="Write down the error" />
        <BtnRow>
          <FillBtn onClick={() => props.submit(inputMsg)} disabled={inputMsg == ''}>
            Report
          </FillBtn>
          <StrokeBtn onClick={() => setInputMsg(props.toggleModal)}>Cancel</StrokeBtn>
        </BtnRow>
      </Modal>
    )
  } else {
    return null
  }
}

const TextAreaInput = styled.textarea`
  ${typography.b02};
  width: 100%;
  height: 120px;
  padding: 16px;
  margin-top: 20px;
  border-radius: 6px;
  box-sizing: border-box;
  border: 1px solid ${palette.grey[500]};
  resize: vertical;
  &::placeholder {
    color: ${palette.grey[500]};
  }
  &:focus {
    outline: none;
    border-color: ${palette.grey[200]};
  }
`

const BtnRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`
