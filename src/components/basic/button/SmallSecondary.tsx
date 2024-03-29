import styled from '@emotion/styled'
import { palette, typography } from '@styles/theme'

interface Props {
  children: React.ReactNode
  disabled?: boolean
  onClick: () => void
}

export function SmallSecondaryButton({ children, disabled = false, onClick }: Props) {
  return (
    <Container onClick={onClick} disabled={disabled}>
      {children}
    </Container>
  )
}

const Container = styled.button`
  border: none;
  text-align: center;
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 4px;
  ${typography.overline};
  background-color: ${palette.grey600};
  color: black;

  &:hover {
    background-color: ${palette.grey500};
    cursor: pointer;
  }

  :disabled {
    background-color: ${palette.grey600};
    cursor: not-allowed;
    color: white;
  }
`
