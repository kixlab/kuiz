import { CreateOptionParams, CreateOptionResults } from '@api/createOption'
import { CreateQStemParams, CreateQStemResults } from '@api/createQuestion'
import { LoadClassInfoParams, LoadClassInfoResults } from '@api/loadClassInfo'
import { Required } from '@components/Required'
import { Sheet } from '@components/Sheet'
import { StarterHelper } from '@components/StarterHelper'
import { StemHelper } from '@components/StemHelper'
import { Label } from '@components/basic/Label'
import { FillButton } from '@components/basic/button/Fill'
import { SelectInput } from '@components/basic/input/Select'
import { TextInput } from '@components/basic/input/Text'
import styled from '@emotion/styled'
import { RootState } from '@redux/store'
import { request } from '@utils/api'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { BLOOMS_TAXONOMY } from 'src/constants/bloomsTaxonomy'
import { CONDITION } from 'src/constants/conditions'
import { useAPILoading } from 'src/hooks/useButton'
import { useQueryParam } from 'src/hooks/useQueryParam'

export default function Page() {
  const { isLoading: submitStemLoading, callAPI: submitStemHandleClick } = useAPILoading()
  const { push, query } = useRouter()
  const cid = query.cid as string | undefined
  const [answer, setAnswer] = useState('')
  const [topics, setTopics] = useState<string[]>([])
  const [topic, setTopic] = useState((query.topic as string | undefined) ?? '')
  const [method, setMethod] = useState(BLOOMS_TAXONOMY[0])
  const [explanation, setExplanation] = useState('')
  const [question, setQuestion] = useState('')
  const className = useSelector((state: RootState) => state.userInfo.classes.find(c => c.cid === cid)?.name)
  const [condition] = useQueryParam('c')

  const submitStem = useCallback(async () => {
    const fields = [topic, explanation, question, answer]
    const fieldNames = ['topic', 'explanation', 'question', 'answer']
    for (let i = 0; i < fields.length; i += 1) {
      const field = fields[i]
      const fieldName = fieldNames[i]
      if (field.trim().length === 0) {
        alert(`Please enter ${fieldName}.`)
        return
      }
    }
    await submitStemHandleClick<void>(async () => {
      if (cid) {
        const res = await request<CreateQStemParams, CreateQStemResults>(`createQuestion`, {
          qstemObj: {
            stem_text: question,
            explanation,
            keyword: [],
            cid,
            options: [],
            optionSets: [],
            learningObjective: `To ${method} the concept of ${topic}`,
          },
        })
        if (res) {
          await request<CreateOptionParams, CreateOptionResults>(`createOption`, {
            optionData: {
              option_text: answer,
              is_answer: true,
              class: cid,
              qstem: res.data,
              keywords: [],
            },
            similarOptions: [],
          })

          push(`/class/${cid}?topic=${topic}&c=${condition}`)
        }
      }
    })
  }, [topic, explanation, question, answer, submitStemHandleClick, cid, method, push, condition])

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
      request<LoadClassInfoParams, LoadClassInfoResults>(`loadClassInfo`, { cid }).then(res => {
        if (res) {
          setTopics(res.topics.map(t => t.label))
        }
      })
    }
  }, [cid])

  return (
    <>
      <Head>
        <title>{`Create Question | ${className}`}</title>
      </Head>
      <Sheet gap={0}>
        <Label color={'primaryMain'} size={0} marginBottom={8}>
          Learning Objective <Required />
        </Label>
        <TopicContainer>
          To <SelectInput options={BLOOMS_TAXONOMY} value={method} onSelect={onSelectMethod} />
          the concept of
          <SelectInput options={topics} value={topic} onSelect={onSelectTopic} placeholder="topic" />
        </TopicContainer>

        <Label color={'primaryMain'} size={0} marginBottom={8}>
          Question <Required />
        </Label>
        <TextInput
          placeholder="E.g. What benefits do keyboard shortcuts provide users?"
          value={question}
          onChange={setQuestion}
          marginBottom={8}
        />

        {[CONDITION.AIOnly, CONDITION.ModularAI].some(c => c === condition) && (
          <StarterHelper cid={cid} topic={topic} />
        )}

        {[CONDITION.AIOnly, CONDITION.ModularAI].some(c => c === condition) && (
          <StemHelper cid={cid} question={question} method={method} topic={topic} explanation={explanation} />
        )}

        <Label color={'primaryMain'} size={0} marginBottom={8} marginTop={12}>
          Explanation <Required />
        </Label>
        <TextInput
          placeholder="Provide an explanation for the question and the intent behind the question."
          value={explanation}
          onChange={setExplanation}
          marginBottom={24}
        />

        <Label color={'primaryMain'} size={0} marginBottom={8}>
          Answer <Required />
        </Label>
        <TextInput
          placeholder="Suggest one correct answer for the question"
          value={answer}
          onChange={setAnswer}
          marginBottom={24}
        />
        <FillButton onClick={submitStem} disabled={submitStemLoading}>
          Submit
        </FillButton>
      </Sheet>
    </>
  )
}

const TopicContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1ch;
  margin-bottom: 24px;
  font-size: 16px;
`
