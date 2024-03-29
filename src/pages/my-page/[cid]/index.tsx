import { StrokeButton } from '@components/basic/button/Stroke'
import { Label } from '@components/basic/Label'
import { MadeOption } from '@components/MadeOption'
import { MadeStem } from '@components/MadeStem'
import { Sheet } from '@components/Sheet'
import { logout } from '@redux/features/userSlice'
import { RootState } from '@redux/store'
import { QStem } from '@server/db/qstem'
import { request } from '@utils/api'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetQstemByOptionParams, GetQstemByOptionResults } from '@api/getQstemByOption'
import { LoadCreatedOptionParams, LoadCreatedOptionResults } from '@api/loadCreatedOption'
import { LoadCreatedStemDataParams, LoadCreatedStemDataResults } from '@api/loadCreatedStemData'
import Head from 'next/head'
import { Required } from '@components/Required'
import { SelectInput } from '@components/basic/input/Select'
import { Topic } from '@server/db/topic'
import styled from '@emotion/styled'
import { LoadClassInfoParams, LoadClassInfoResults } from '@api/loadClassInfo'
import { useQueryParam } from 'src/hooks/useQueryParam'

export default function Page() {
  const { query, push } = useRouter()
  const cid = query.cid as string | undefined
  const [condition] = useQueryParam('c')
  const [topic, setTopic] = useQueryParam('topic')
  const studentID = useSelector((state: RootState) => state.userInfo.studentID)
  const dispatch = useDispatch()
  const [myQuestions, setMyQuestions] = useState<QStem[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [myOptions, setMyOptions] = useState<
    { qid: string; stemText: string; optionText: string; isAnswer: boolean; cid: string }[]
  >([])

  const getMadeStem = useCallback(() => {
    if (cid) {
      request<LoadCreatedStemDataParams, LoadCreatedStemDataResults>(`loadCreatedStemData`, {
        cid: cid,
        topic: topic ?? undefined,
      }).then(res => {
        if (res) {
          setMyQuestions(res.madeStem.reverse())
        }
      })
    }
  }, [cid, topic])

  const getMadeOption = useCallback(async () => {
    if (cid) {
      const res = await request<LoadCreatedOptionParams, LoadCreatedOptionResults>(`loadCreatedOption`, {
        cid: cid,
        topic: topic ?? undefined,
      })
      if (res) {
        const res2 = await request<GetQstemByOptionParams, GetQstemByOptionResults>(`getQstemByOption`, {
          qstems: res.madeOption.map(o => o.qstem.toString()),
        })
        if (res2) {
          const optionList = res.madeOption
          const qlist = res2.qstems
          const newOptionList = optionList.map((option, index) => ({
            qid: qlist[index]._id,
            stemText: qlist[index].stem_text,
            optionText: option.option_text,
            isAnswer: option.is_answer,
            cid: qlist[index].class.toString(),
          }))
          setMyOptions(newOptionList.reverse())
        }
      }
    }
  }, [cid, topic])

  const onInsertStudentID = useCallback(() => {
    push(`/register?c=${condition}`)
  }, [condition, push])

  const logOut = useCallback(() => {
    signOut()
    dispatch(logout())
    push(`/?c=${condition}`)
  }, [condition, dispatch, push])

  const onSelectTopic = useCallback(
    (i: number) => {
      const t = topics[i]
      setTopic(t.label)
    },
    [setTopic, topics]
  )

  useEffect(() => {
    getMadeStem()
    getMadeOption()
    if (cid) {
      request<LoadClassInfoParams, LoadClassInfoResults>(`loadClassInfo`, {
        cid,
      }).then(async res => {
        if (res) {
          setTopics(res.topics)
          if (topic === undefined) {
            if (res.currentTopic) {
              const indexOfTopic = res.topics.findIndex(topic => topic._id === res.currentTopic)
              if (indexOfTopic != -1) {
                setTopic(res.topics[indexOfTopic].label)
              }
            }
          }
        }
      })
    }
  }, [getMadeOption, getMadeStem, studentID, cid, push, topic, setTopic])

  return (
    <>
      <Head>
        <title>My Page</title>
      </Head>
      <Sheet>
        <Label>
          Student ID <Required />
        </Label>
        {studentID ?? 'Not registered'}
        <StrokeButton onClick={onInsertStudentID}>{studentID ? 'Update Student ID' : 'Add Student ID'}</StrokeButton>

        {0 < myQuestions.length && (
          <>
            <Linear>
              <Label size={0}>My Questions</Label>

              <Linear>
                <span>Filter by:</span>
                <SelectInput
                  options={topics.map(t => t.label)}
                  value={topic ?? null}
                  onSelect={onSelectTopic}
                  placeholder={'Select topic'}
                  marginLeft={8}
                />
              </Linear>
            </Linear>
          </>
        )}
        {myQuestions.map(stem => {
          return <MadeStem key={stem._id} qid={stem._id} question={stem.stem_text} cid={stem.class.toString()} />
        })}
        {0 < myOptions.length && <Label size={0}>My Options</Label>}
        {myOptions.map((option, i) => {
          return (
            <MadeOption
              key={i}
              optionType={option.isAnswer ? 'Answer' : 'Distractor'}
              qid={option.qid}
              cid={option.cid}
              question={option.stemText}
              option={option.optionText}
            />
          )
        })}
        <StrokeButton onClick={logOut}>Log out</StrokeButton>
      </Sheet>
    </>
  )
}

const Linear = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`
