import styled from '@emotion/styled'
import { typography, palette } from '@styles/theme'

interface Props {
  placeholder: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const TextInput = (props: Props) => {
  return <TextInputComponent type="text" placeholder={props.placeholder} onChange={props.onChange} />
}

const TextInputComponent = styled.input`
  ${typography.b02};
  padding: 16px;
  border-radius: 6px;
  border: 1px solid ${palette.grey[500]};
  width: 100%;
  box-sizing: border-box;
  &::placeholder {
    color: ${palette.grey[500]};
  }
  &:focus {
    outline: none;
    border-color: ${palette.grey[200]};
  }
`
