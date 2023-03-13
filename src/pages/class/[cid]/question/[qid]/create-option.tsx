import { CreateOptionParams, CreateOptionResults } from '@api/createOption'
import { LoadOptionsParams, LoadOptionsResults } from '@api/loadOptions'
import { OptionBtn } from '@components/basic/button/OptionButton'
import { Label } from '@components/basic/Label'
import { CreateNewOption } from '@components/CreateNewOption'
import styled from '@emotion/styled'
import { Option } from '@server/db/option'
import { QStem } from '@server/db/qstem'
import { typography } from '@styles/theme'
import { request } from '@utils/api'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

export default function Page() {
  const { push, query } = useRouter()
  const qid = query.qid as string | undefined
  const cid = query.cid as string | undefined
  const [ansList, setAnsList] = useState<Option[]>([])
  const [disList, setDistList] = useState<Option[]>([])
  const [qinfo, setQinfo] = useState<QStem>()
  const [similarOptions, setSimilarOptions] = useState<string[]>([])

  // My option values
  const [option, setOption] = useState('')
  const [isAnswer, setIsAnswer] = useState(false)
  const [keywords, setKeywords] = useState<string[]>([])

  useEffect(() => {
    if (qid) {
      request<LoadOptionsParams, LoadOptionsResults>(`loadOptions`, {
        qid,
      }).then(res => {
        if (res) {
          const ans = res.options.filter(op => op.is_answer === true)
          const dis = res.options.filter(op => op.is_answer === false)

          setAnsList(ans)
          setDistList(dis)
          setQinfo(res.qinfo)
        }
      })
    }
  }, [push, qid, setAnsList, setDistList, setQinfo])

  const submit = useCallback(async () => {
    if (cid && qid) {
      const optionData = {
        option_text: option,
        is_answer: isAnswer,
        explanation: '',
        class: cid,
        qstem: qid,
        keywords,
      }

      if (keywords.length > 0 && option.length > 0) {
        if (keywords.includes('Form similar to answer')) {
          ansList.forEach(item => {
            if (!similarOptions.includes(item._id)) {
              setSimilarOptions([item._id, ...similarOptions])
            }
          })
        }
      }

      await request<CreateOptionParams, CreateOptionResults>(`createOption`, {
        optionData,
        similarOptions: similarOptions,
      })
      push('/class/' + cid)
    }
  }, [ansList, cid, isAnswer, keywords, push, option, qid, similarOptions])

  return (
    <QuestionBox>
      <div>
        <Label color="blue" size={0}>
          Topic
        </Label>
        <SectionText>{qinfo?.learning_objective}</SectionText>
      </div>
      <div>
        <Label color="blue" size={0}>
          Explanation
        </Label>
        <SectionText>{qinfo?.explanation}</SectionText>
      </div>
      <DividerLine />
      <div>
        <Label color="blue" size={0}>
          Question
        </Label>
        <SectionText>Q. {qinfo?.stem_text}</SectionText>
      </div>

      <div>
        {ansList.map((item, i) => (
          <OptionBtn key={i} state={true} selected={false}>
            <div>✅</div>
            {item?.option_text}
          </OptionBtn>
        ))}
        {disList.map((item, i) => (
          <OptionBtn key={i} state={true} selected={false}>
            <div>❌</div>
            {item?.option_text}
          </OptionBtn>
        ))}
      </div>
      <DividerLine />
      <CreateNewOption
        isAnswer={isAnswer}
        setIsAnswer={setIsAnswer}
        setOption={setOption}
        setKeywords={setKeywords}
        onSubmit={submit}
      />
    </QuestionBox>
  )
}

const QuestionBox = styled.div`
  border-radius: 8px;
  background-color: white;
  margin: 40px 0 40px 0;
  padding: 30px;
  display: flex;
  gap: 28px;
  flex-direction: column;
`

const DividerLine = styled.hr`
  width: 100%;
  border: 0;
  height: 1px;
  background-color: #dbdbdb;
`

const SectionText = styled.div`
  ${typography.b02};
`
