import styled from '@emotion/styled'
import { MadeOption } from '../Components/MadeOption'
import { MadeStem } from '../Components/MadeStem'
import { googleLogout } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { useCallback, useState, useEffect } from 'react'
import { logout } from '../state/features/userSlice'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../state/store'
import { optionType } from '../apiTypes/option'
import { qinfoType } from '../apiTypes/qinfo'
import { StrokeBtn } from '../Components/basic/button/Button'
import { Label } from '../Components/basic/Label'
import { palette, typography } from '../styles/theme'
import { Post } from '../utils/apiRequest'
import { loadCreatedStemDataParams, loadCreatedStemDataResults } from '../api/question/loadCreatedStemData'
import { LoadCreatedOptionParams, LoadCreatedOptionResults } from '../api/question/option/loadCreatedOption'
import { GetQstemByOptionParams, GetQstemByOptionResults } from '../api/question/getQStemByOption'
import { addUserMadeOptions, addUserMadeQuestions } from '../state/features/cacheSlice'

interface optionWithQinfo extends optionType {
  qinfo: GetQstemByOptionResults['qstems'][0]
}

interface Props {
  stemNum: number
  optionNum: number
}

export function MyPage(props: Props) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const uid = useSelector((state: RootState) => state.userInfo?._id)
  const [madeStem, setMadeStem] = useState<qinfoType[]>([])
  const [madeOption, setMadeOption] = useState<optionWithQinfo[]>([])
  const userMadeOptions = useSelector((state: RootState) => state.cache.userMadeOptions)
  const userMadeQuestions = useSelector((state: RootState) => state.cache.userMadeQuestions)

  const getMadeStem = useCallback(() => {
    if (userMadeQuestions.length > 0) {
      setMadeStem(userMadeQuestions)
    } else {
      Post<loadCreatedStemDataParams, loadCreatedStemDataResults>(
        `${process.env.REACT_APP_BACK_END}/question/made/stem`,
        { uid: uid }
      ).then((res: loadCreatedStemDataResults | null) => {
        if (res) {
          setMadeStem(res.madeStem.reverse())
          dispatch(addUserMadeQuestions(res.madeStem.reverse()))
        }
      })
    }
  }, [userMadeQuestions, uid])
  const getMadeOption = useCallback(() => {
    if (userMadeOptions.length > 0) {
      setMadeOption(userMadeOptions)
    } else {
      Post<LoadCreatedOptionParams, LoadCreatedOptionResults>(
        `${process.env.REACT_APP_BACK_END}/question/made/option`,
        {
          uid: uid,
        }
      ).then((res: LoadCreatedOptionResults | null) => {
        if (res) {
          Post<GetQstemByOptionParams, GetQstemByOptionResults>(
            `${process.env.REACT_APP_BACK_END}/question/qstembyoption`,
            {
              qstems: res.madeOption.map((o: optionType) => o.qstem),
            }
          ).then((res2: GetQstemByOptionResults | null) => {
            if (res2) {
              const optionList = res.madeOption
              const qlist = res2.qstems.map((qstem: string) => {
                return { qinfo: qstem }
              })
              const newOptionList = optionList.map((option: optionType, index: number) => ({
                ...option,
                ...qlist[index],
              }))
              setMadeOption(newOptionList.reverse())
              dispatch(addUserMadeOptions(newOptionList.reverse()))
            }
          })
        }
      })
    }
  }, [userMadeOptions, uid])

  const signOut = useCallback(() => {
    googleLogout()
    dispatch(logout())
    navigate('/')
  }, [])

  useEffect(() => {
    getMadeStem()
    getMadeOption()
  }, [getMadeOption, getMadeStem])

  return (
    <div>
      <div>
        <DataLabel>
          <Label text="Created Question Stems" color="black" size={0} />
          {props.stemNum}
        </DataLabel>
        <MadeLists>
          {madeStem.map((stem: qinfoType, index: number) => {
            return <MadeStem key={index} qid={stem._id} question={stem.raw_string} />
          })}
        </MadeLists>
      </div>
      <div>
        <DataLabel>
          <Label text="Created Options" color="black" size={0} />
          {props.stemNum}
        </DataLabel>
        <MadeLists>
          {madeOption.map((option: optionWithQinfo, index: number) => {
            return (
              <MadeOption
                key={index}
                optionType={option.is_answer ? 'Answer' : 'Distractor'}
                qid={option.qinfo._id}
                question={option.qinfo.raw_string}
                option={option.option_text}
              />
            )
          })}
        </MadeLists>
      </div>
      <StrokeBtn onClick={signOut}>Log out</StrokeBtn>
    </div>
  )
}

const MadeLists = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
`

const DataLabel = styled.div`
  ${typography.hLabel};
  color: ${palette.primary.main};
  padding: 30px 0 12px;
  display: flex;
  gap: 10px;
`
