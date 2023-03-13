import { LoadProblemListParams, LoadProblemListResults } from '@api/loadProblemList'
import { FloatingButton } from '@components/basic/button/Floating'
import { QuizListHeader } from '@components/QuizListHeader'
import { QuizListItem } from '@components/QuizListItem'
import { Sheet } from '@components/Sheet'
import styled from '@emotion/styled'
import { QStem } from '@server/db/qstem'
import { request } from '@utils/api'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

export default function Page() {
  const { query, push } = useRouter()
  const cid = query.cid as string | undefined
  const [questionList, setQuestionList] = useState<QStem[]>([])

  useEffect(() => {
    if (cid) {
      request<LoadProblemListParams, LoadProblemListResults>(`loadProblemList`, {
        cid,
      }).then(res => {
        if (res) {
          setQuestionList(res.problemList.reverse())
        }
      })
    }
  }, [cid, setQuestionList])

  const onSolve = useCallback(
    (qid: string) => () => {
      push(`/class/${cid}/question/${qid}/solve`)
    },
    [cid, push]
  )

  const onAddOption = useCallback(
    (qid: string) => () => {
      push(`/class/${cid}/question/${qid}/create-option`)
    },
    [cid, push]
  )

  const onCreateQuestion = useCallback(() => {
    push(`/class/${cid}/question/create`)
  }, [cid, push])

  return (
    <>
      <Sheet padding={0} gap={8}>
        <QuizListHeader />
        {questionList.map((question, i) => (
          <QuizListItem
            key={i}
            title={question.stem_text}
            options={question.options.length}
            date={question.updatedAt ? new Date(question.updatedAt) : new Date(question.createdAt)}
            onSolve={onSolve(question._id)}
            onAddOption={onAddOption(question._id)}
          />
        ))}
      </Sheet>
      <FloatingButton onClick={onCreateQuestion}>Create a New Question</FloatingButton>
    </>
  )
}
