import { CategoryInput } from './CategoryInput'
import styled from '@emotion/styled'
import { FillBtn } from './basic/button/Button'
import { TextInput } from './basic/input/Text'
import { TagBtn } from './basic/button/TagButton'
import { Label } from './basic/Label'
import { useCallback } from 'react'

interface Props {
  isAnswer: boolean
  setIsAnswer: (item: boolean) => void
  setOption: (item: string) => void
  setKeywords: (item: string[]) => void
  onSubmit: () => void
}

export const CreateNewOption = (props: Props) => {
  const updateSuggested = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      props.setOption(e.target.value)
    },
    [props]
  )

  return (
    <div>
      <Container>
        <div>
          <Label color="blue" size={0}>
            Create New Option
          </Label>
          <TagBtn onClick={() => props.setIsAnswer(true)} id={props.isAnswer ? 'AnsAct' : 'Ans'}>
            Answer
          </TagBtn>
          <TagBtn onClick={() => props.setIsAnswer(false)} id={!props.isAnswer ? 'DistAct' : 'Dist'}>
            Distractor
          </TagBtn>
        </div>
        <Block>
          <TextInput placeholder="Suggest an answer or distractor for this question" onChange={updateSuggested} />
          <CategoryInput getCategory={props.setKeywords} />
        </Block>
        <FillBtn onClick={props.onSubmit}>Submit</FillBtn>
      </Container>
    </div>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`
