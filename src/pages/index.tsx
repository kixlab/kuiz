import { LoadUserInfoParams, LoadUserInfoResults } from '@api/loadUserInfo'
import { FillBtn } from '@components/basic/button/Button'
import { TextInput } from '@components/basic/input/Text'
import { Sheet } from '@components/Sheet'
import styled from '@emotion/styled'
import { enroll, login, updateStudentID } from '@redux/features/userSlice'
import { RootState } from '@redux/store'
import { palette, typography } from '@styles/theme'
import { request } from '@utils/api'
import { ClientSafeProvider, getProviders, signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AsyncReturnType } from 'src/types/utils'
import { JoinClassParams, JoinClassResults } from './api/joinClass'

interface Props {
  providers: AsyncReturnType<typeof getProviders>
}

export default function Page({ providers }: Props) {
  const { data: session } = useSession()
  const { push, query } = useRouter()
  const dispatch = useDispatch()
  const classes = useSelector((state: RootState) => state.userInfo.classes)
  const [code, setCode] = useState('')

  const detectChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCode(e.target.value)
    },
    [setCode]
  )

  useEffect(() => {
    if (session) {
      request<LoadUserInfoParams, LoadUserInfoResults>('/loadUserInfo', {}).then(res => {
        if (res) {
          const { user, classes } = res
          dispatch(
            login({
              name: user.name,
              email: user.email,
              img: user.imageUrl,
              classes,
              isLoggedIn: true,
              isAdmin: user.isAdmin,
              made: user.made.map(c => c.toString()),
              madeOptions: user.madeOptions.map(c => c.toString()),
              solved: user.solved.map(c => c.toString()),
            })
          )
          if (user.studentID) {
            dispatch(updateStudentID(user.studentID))
          }
        }
      })
    }
  }, [push, dispatch, session])

  const onSubmit = useCallback(async () => {
    const res = await request<JoinClassParams, JoinClassResults>(`joinClass`, {
      code: code,
    })
    if (res?.cid) {
      dispatch(enroll({ name: res.name, cid: res.cid }))
    }
  }, [code, dispatch])

  const onClassEnter = useCallback(
    (cid: string) => async () => {
      push(`/class/${cid}`)
    },
    [push]
  )

  const signInCallback = useCallback(
    (provider: ClientSafeProvider) => async () => {
      const callbackUrl = (query.callbackUrl ?? '/') as string
      await signIn(provider.id, { callbackUrl })
    },
    [query.callbackUrl]
  )

  return (
    <>
      {session ? (
        <Sheet>
          <Header>Choose a Class or Enroll in a new Class</Header>
          {classes.map(({ cid, name }, i) => (
            <ClassButton key={i} onClick={onClassEnter(cid)}>
              {name}
              {/* ({code}) */}
            </ClassButton>
          ))}
          <InputSection>
            <TextInput placeholder="Enter class code" onChange={detectChange} />
            <FillBtn onClick={onSubmit}>Enter</FillBtn>
          </InputSection>
        </Sheet>
      ) : (
        <>
          <IntroBox>
            Hello, we are the research team from KAIST Interaction Lab (KIXLAB)
            <br />
            <br />
            Thank you for showing interest in our research. We are currently examining the effects of learnersourcing in
            Multiple-choice question (MCQ) generation tasks.
            <br />
            <br />
            To reduce the burden caused by question generation tasks, as well as allowing for training in question
            generation, we developed KUIZ, a system facilitating modular learnersourcing for multiple-choice questions.
            <br />
            <br />
            If you participate in this study, you will be given a task to create MCQ stems and options based on your
            lecture materials
            <br />
            <br />
            The system is currently on its pilot version, and we are currently running usability tests while validating
            the learnersourcing approach.
            <br />
            Please be understanding if you find limitations or errors within our system.
            <br />
            <br />
            We are collecting Google sign-in information for account connection. This information is used solely for
            identifying individual data and log-in, and other personal information is not used or accessed in the
            process. After the experiment ends, private information and account information will be all deleted.
            <br />
            <br />
            If you have any questions, please contact the research team (haesookim@kaist.ac.kr).
            <br />
            <br />
            Thank you.
          </IntroBox>
          {providers &&
            Object.values(providers).map(provider => (
              <FillBtn key={provider.id} onClick={signInCallback(provider)}>
                Sign In With {provider.name}
              </FillBtn>
            ))}
        </>
      )}
    </>
  )
}

const ClassButton = styled.button`
  font-family: 'inter-r';
  font-size: 15px;
  padding: 16px;
  border-radius: 6px;
  background: ${palette.primary.light};
  width: 100%;
  box-sizing: border-box;
  border: 2px solid transparent;
  cursor: pointer;
  &:hover {
    border-color: ${palette.primary.main};
  }
`

const IntroBox = styled.div`
  border-radius: 8px;
  background-color: white;
  padding: 28px;
  box-sizing: border-box;
  margin-bottom: 24px;
  ${typography.b02};
`

const Header = styled.div`
  ${typography.hLabel};
`

const InputSection = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 12px;
`

export async function getServerSideProps() {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}
