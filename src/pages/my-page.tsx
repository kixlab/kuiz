import { StrokeBtn } from '@components/basic/button/Button'
import { Label } from '@components/basic/Label'
import { MadeOption } from '@components/MadeOption'
import { MadeStem } from '@components/MadeStem'
import styled from '@emotion/styled'
import { logout } from '@redux/features/userSlice'
import { QStem } from '@server/db/qstem'
import { palette, typography } from '@styles/theme'
import { request } from '@utils/api'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { GetQstemByOptionParams, GetQstemByOptionResults } from './api/getQstemByOption'
import { LoadCreatedStemDataParams, LoadCreatedStemDataResults } from './api/loadCreatedStemData'
import { LoadCreatedOptionParams, LoadCreatedOptionResults } from './api/loadCreatedOption'

export default function Page() {
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

  const logOut = useCallback(() => {
    signOut()
    dispatch(logout())
    push('/')
  }, [dispatch, push])

  useEffect(() => {
    getMadeStem()
    getMadeOption()
  }, [getMadeOption, getMadeStem])

  return (
    <>
      <div>
        <DataLabel>
          <Label text="Created Question Stems" color="black" size={0} />
        </DataLabel>
        <MadeLists>
          {madeStem.map(stem => {
            return <MadeStem key={stem._id} qid={stem._id} question={stem.stem_text} />
          })}
        </MadeLists>
      </div>
      <div>
        <DataLabel>
          <Label text="Created Options" color="black" size={0} />
        </DataLabel>
        <MadeLists>
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
        </MadeLists>
      </div>
      <StrokeBtn onClick={logOut}>Log out</StrokeBtn>
    </>
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