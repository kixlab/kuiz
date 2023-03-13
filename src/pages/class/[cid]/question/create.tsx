import { FillBtn } from '@components/basic/button/Button'
import { Label } from '@components/basic/Label'
import { TextEditor } from '@components/TextEditor'
import styled from '@emotion/styled'
import { palette } from '@styles/theme'
import { request } from '@utils/api'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { CreateQStemParams, CreateQStemResults } from '@api/createQuestion'
import { CreateOptionParams, CreateOptionResults } from '@api/createOption'
import { SelectInput } from '@components/basic/input/Select'
import { LoadTopicsParams, LoadTopicsResults } from '@api/loadTopics'
import { Sheet } from '@components/Sheet'

const BLOOMS_TAXONOMY = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create']

export default function Page() {
  const { push, query } = useRouter()
  const cid = query.cid as string | undefined
  const [answer, setAnswer] = useState('')
  const [topics, setTopics] = useState<string[]>([])
  const [topic, setTopic] = useState(topics[0] ?? '')
  const [method, setMethod] = useState(BLOOMS_TAXONOMY[0])
  const [explanation, setExplanation] = useState('')
  const [question, setQuestion] = useState('')

  const submitStem = useCallback(async () => {
    if (question.trim().length === 0) {
      alert('Please enter a question.')
      return
    }
    if (answer.trim().length === 0) {
      alert('Please enter an answer.')
      return
    }

    if (cid) {
      const res = await request<CreateQStemParams, CreateQStemResults>(`createQuestion`, {
        qstemObj: {
          stem_text: question,
          explanation,
          action_verb: [],
          keyword: [],
          cid,
          options: [],
          optionSets: [],
          learning_objective: `To ${method} the concept of ${topic}`,
        },
      })
      if (res) {
        await request<CreateOptionParams, CreateOptionResults>(`createOption`, {
          optionData: {
            option_text: answer,
            is_answer: true,
            explanation,
            class: cid,
            qstem: res.data,
            keywords: [],
          },
          similarOptions: [],
        })

        push('/class/' + cid + '/question/' + res.data + '/create-option')
      }
    }
  }, [question, answer, cid, explanation, method, topic, push])

  const onSelectTopic = useCallback(
    (i: number) => {
      setTopic(topics[i])
    },
    [topics]
  )

  const onSelectMethod = useCallback((i: number) => {
    setMethod(BLOOMS_TAXONOMY[i])
  }, [])

  useEffect(() => {
    if (cid) {
      request<LoadTopicsParams, LoadTopicsResults>(`loadTopics`, { cid }).then(res => {
        if (res) {
          setTopics(res.topics)
        }
      })
    }
  }, [cid])

  return (
    <Sheet>
      <div>
        <Label color="blue" size={0}>
          Topic
        </Label>
        <TopicContainer>
          To <SelectInput options={BLOOMS_TAXONOMY} value={method} onSelect={onSelectMethod} />
          the concept of
          <SelectInput options={topics} value={topic} onSelect={onSelectTopic} />
        </TopicContainer>
      </div>
      <div>
        <Label color="blue" size={0}>
          Question
        </Label>
        <TextEditor placeholder="(e.g., )" value={question} onChange={setQuestion} />
      </div>
      <div>
        <Label color="blue" size={0}>
          Answer
        </Label>
        <TextEditor placeholder="Answer of the question" value={answer} onChange={setAnswer} />
      </div>
      <div>
        <Label color="blue" size={0}>
          Explanation
        </Label>
        <TextEditor placeholder="Explanation of your answer" value={explanation} onChange={setExplanation} />
      </div>
      <FillBtn onClick={submitStem}>Submit</FillBtn>
    </Sheet>
  )
}

const TopicContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1ch;
`
