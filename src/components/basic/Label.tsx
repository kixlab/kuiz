import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { typography, palette } from '@styles/theme'

interface Props {
  children: React.ReactNode
  color?: 'black' | 'blue'
  size?: number
}

export const Label = ({ children, color = 'black', size = 0 }: Props) => {
  return (
    <LabelComponent color={color} size={size}>
      {children}
    </LabelComponent>
  )
}

const LabelComponent = styled.div<{ color: string; size: number }>`
  ${({ color, size }) => css`
    ${size === 0
      ? css`
          ${typography.hLabel}
        `
      : css`
          ${typography.hStem}
        `}
    ${color === 'blue'
      ? css`
          color: ${palette.primary.main};
        `
      : css`
          color: ${palette.grey[200]};
        `}
  `}
`
