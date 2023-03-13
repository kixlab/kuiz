import { StrokeBtn } from '@components/basic/button/Button'
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
import { GetQstemByOptionParams, GetQstemByOptionResults } from './api/getQstemByOption'
import { LoadCreatedOptionParams, LoadCreatedOptionResults } from './api/loadCreatedOption'
import { LoadCreatedStemDataParams, LoadCreatedStemDataResults } from './api/loadCreatedStemData'

export default function Page() {
  const studentID = useSelector((state: RootState) => state.userInfo.studentID)
  const { push } = useRouter()
  const dispatch = useDispatch()
  const [madeStem, setMadeStem] = useState<QStem[]>([])
  const [madeOption, setMadeOption] = useState<
    { qid: string; stemText: string; optionText: string; isAnswer: boolean }[]
  >([])

  const getMadeStem = useCallback(() => {
    request<LoadCreatedStemDataParams, LoadCreatedStemDataResults>(`loadCreatedStemData`, {}).then(res => {
      if (res) {
        setMadeStem(res.madeStem.reverse())
      }
    })
  }, [])

  const getMadeOption = useCallback(async () => {
    const res = await request<LoadCreatedOptionParams, LoadCreatedOptionResults>(`loadCreatedOption`, {})
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
        }))
        setMadeOption(newOptionList.reverse())
      }
    }
  }, [])

  const onInsertStudentID = useCallback(() => {
    push('/register')
  }, [push])

  const logOut = useCallback(() => {
    signOut()
    dispatch(logout())
    push('/')
  }, [dispatch, push])

  useEffect(() => {
    getMadeStem()
    getMadeOption()
  }, [getMadeOption, getMadeStem, studentID])

  return (
    <Sheet>
      <Label>Student ID</Label>
      {studentID ?? 'Not registered'}
      <StrokeBtn onClick={onInsertStudentID}>{studentID ? 'Update Student ID' : 'Add Student ID'}</StrokeBtn>

      {0 < madeStem.length && (
        <Label color="black" size={0}>
          My Questions
        </Label>
      )}
      {madeStem.map(stem => {
        return <MadeStem key={stem._id} qid={stem._id} question={stem.stem_text} />
      })}
      {0 < madeOption.length && (
        <Label color="black" size={0}>
          My Options
        </Label>
      )}
      {madeOption.map((option, i) => {
        return (
          <MadeOption
            key={i}
            optionType={option.isAnswer ? 'Answer' : 'Distractor'}
            qid={option.qid}
            question={option.stemText}
            option={option.optionText}
          />
        )
      })}
      <StrokeBtn onClick={logOut}>Log out</StrokeBtn>
    </Sheet>
  )
}
