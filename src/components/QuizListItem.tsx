import styled from '@emotion/styled'
import { typography } from '@styles/theme'
import { MOBILE_WIDTH_THRESHOLD } from 'src/constants/ui'
import { SmallPrimaryButton } from './basic/button/SmallPrimary'
import { SmallSecondaryButton } from './basic/button/SmallSecondary'
import { CONDITION } from 'src/constants/conditions'
import { useQueryParam } from 'src/hooks/useQueryParam'

interface Props {
  title: string
  options: number
  onSolve: () => void
  onAddOption: () => void
}

export const QuizListItem = ({ title, options, onAddOption, onSolve }: Props) => {
  const [condition] = useQueryParam('c')

  return (
    <Container>
      <QuizText>{title}</QuizText>
      <Item>{options}</Item>
      <ButtonArea>
        <SmallSecondaryButton onClick={onSolve}>
          Solve <span>&gt;</span>
        </SmallSecondaryButton>
        {[CONDITION.ModularAI, CONDITION.ModularOnly].some(c => c === condition) && (
          <SmallPrimaryButton onClick={onAddOption}>
            Add Option <span>&gt;</span>
          </SmallPrimaryButton>
        )}
      </ButtonArea>
    </Container>
  )
}

const Container = styled.div`
  width: calc(100% - 32px);
  text-align: center;
  display: grid;
  align-items: center;
  grid-template-columns: auto 100px 130px;
  column-gap: 8px;
  background-color: white;
  padding: 8px 16px;
  ${typography.b02};
  text-align: center;

  @media (max-width: ${MOBILE_WIDTH_THRESHOLD}px) {
    grid-template-columns: auto 0 0 100px;
  }

  :nth-of-type(2) {
    padding-top: 16px;
  }

  :last-of-type {
    padding-bottom: 16px;
  }
`

const Item = styled.div`
  overflow: hidden;
  white-space: normal;
  line-height: 1.3;
  word-wrap: break-word;
  text-overflow: ellipsis;
  max-height: 2.6em;
  text-align: center;
`

const QuizText = styled.div`
  overflow: hidden;
  white-space: normal;
  line-height: 1.3;
  word-wrap: break-word;
  text-overflow: ellipsis;
  max-height: 2.6em;
  text-align: left;
`

const ButtonArea = styled.div`
  display: grid;
  row-gap: 4px;
`
