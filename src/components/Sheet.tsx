import { css } from '@emotion/react'
import styled from '@emotion/styled'

interface Props {
  children: React.ReactNode
  padding?: number
  gap?: number
}

export function Sheet({ children, padding = 24, gap = 16 }: Props) {
  return (
    <Container padding={padding} gap={gap}>
      {children}
    </Container>
  )
}

const Container = styled.div<{ padding: number; gap: number }>`
  ${({ padding, gap }) => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: ${gap}px;
    box-sizing: border-box;
    font-size: 18px;
    background-color: white;
    padding: ${padding}px;
    border-radius: 8px;
    box-shadow: 0px 0px 16px rgba(40, 40, 40, 0.12);
    overflow: hidden;
  `}
`
