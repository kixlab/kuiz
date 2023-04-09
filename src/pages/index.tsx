import {
  UpdateDataCollectionConsentStateParams,
  UpdateDataCollectionConsentStateResults,
} from '@api/updateDataCollectionConsentState'
import { Sheet } from '@components/Sheet'
import { FillButton } from '@components/basic/button/Fill'
import { TextInput } from '@components/basic/input/Text'
import styled from '@emotion/styled'
import { enroll, updateDataCollectionConsentState, updateStudentID } from '@redux/features/userSlice'
import { RootState } from '@redux/store'
import { palette, typography } from '@styles/theme'
import { request } from '@utils/api'
import { ClientSafeProvider, getProviders, signIn, useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AsyncReturnType } from 'src/types/utils'
import { JoinClassParams, JoinClassResults } from './api/joinClass'
import { Label } from '@components/basic/Label'
import { StrokeButton } from '@components/basic/button/Stroke'
import { PutStudentIDParams, PutStudentIDResults } from '@api/insertStudentID'
import { Required } from '@components/Required'

interface Props {
  providers: AsyncReturnType<typeof getProviders>
}

export default function Page({ providers }: Props) {
  const { data: session } = useSession()
  const { push, query } = useRouter()
  const dispatch = useDispatch()
  const classes = useSelector((state: RootState) => state.userInfo.classes)
  const [code, setCode] = useState('')
  const showConsent = useSelector((state: RootState) => !state.userInfo.dataCollectionConsentState)
  const showStudentId = useSelector((state: RootState) => !state.userInfo.studentID)
  const [studentID, setStudentID] = useState('')

  const onCodeChange = useCallback(
    (v: string) => {
      setCode(v.toLowerCase())
    },
    [setCode]
  )

  const onSubmit = useCallback(async () => {
    const res = await request<JoinClassParams, JoinClassResults>(`joinClass`, {
      code,
    })
    if (res?.cid) {
      dispatch(enroll({ name: res.name, cid: res.cid, code }))
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

  const onUpdateDataCollectionConsentState = useCallback(
    async (dataCollectionConsentState: boolean) => {
      const res = await request<UpdateDataCollectionConsentStateParams, UpdateDataCollectionConsentStateResults>(
        `updateDataCollectionConsentState`,
        {
          dataCollectionConsentState,
        }
      )
      if (res) {
        dispatch(updateDataCollectionConsentState(dataCollectionConsentState))
      }
    },
    [dispatch]
  )

  const onRegister = async () => {
    const res = await request<PutStudentIDParams, PutStudentIDResults>(`insertStudentID`, {
      studentID,
    })
    if (res) {
      dispatch(updateStudentID(studentID))
    }
  }

  return (
    <>
      <Head>
        <title>KUIZ</title>
      </Head>
      {session ? (
        <>
          <OnBoardingBox>
            {showConsent && (
              <Sheet gap={0} marginBottom={20}>
                <Label color="primaryMain" marginBottom={8}>
                  Research Consent
                </Label>
                We would like to use questions you created for research purposes.
                <FillButton onClick={() => onUpdateDataCollectionConsentState(true)} marginTop={20}>
                  I give my consent
                </FillButton>
              </Sheet>
            )}
            {showStudentId && (
              <Sheet gap={0} marginBottom={20}>
                <Label color="primaryMain" marginBottom={8}>
                  Register Your ID <Required />
                </Label>
                Please register your student ID for class activity and evaluation.
                <InputSection>
                  <TextInput placeholder="Student ID" onChange={setStudentID} value={studentID} />
                  <FillButton onClick={onRegister}>Register</FillButton>
                </InputSection>
              </Sheet>
            )}
          </OnBoardingBox>
          <Sheet gap={0}>
            <Label>
              Choose a Class or Enroll in a new Class <Required />
            </Label>
            {classes.map(({ cid, name, code }, i) => (
              <ClassButton key={i} onClick={onClassEnter(cid)}>
                {name} ({code.toUpperCase()})
              </ClassButton>
            ))}
            <InputSection>
              <TextInput placeholder="Enter class code" onChange={onCodeChange} value={code} />
              <FillButton onClick={onSubmit}>Enter</FillButton>
            </InputSection>
          </Sheet>
        </>
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
              <FillButton key={provider.id} onClick={signInCallback(provider)}>
                Sign In With {provider.name}
              </FillButton>
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
  background: ${palette.primaryLight};
  width: 100%;
  box-sizing: border-box;
  border: 2px solid transparent;
  cursor: pointer;
  &:hover {
    border-color: ${palette.primaryMain};
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

const OnBoardingBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`

const InputSection = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 100px;
  column-gap: 12px;
  margin-top: 20px;
`

export async function getServerSideProps() {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}
