import styled from '@emotion/styled'
import { TextInput } from '@components/basic/input/Text'
import { FillBtn } from '@components/basic/button/Button'
import { ChangeEvent, useState } from 'react'
import { useRouter } from 'next/router'
import { request } from '@utils/api'
import { PutStudentIDParams, PutStudentIDResults } from '@api/insertStudentID'
import { useDispatch } from 'react-redux'
import { updateStudentID } from '@redux/features/userSlice'
import { MOBILE_WIDTH_THRESHOLD } from 'src/constants/ui'
import { palette, typography } from '@styles/theme'
import { Sheet } from '@components/Sheet'

export default function StudentID() {
  const [insertedStudentID, setInsertedStudentID] = useState('')
  const dispatch = useDispatch()
  const { push } = useRouter()

  const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInsertedStudentID(e.target.value)
  }

  const onSubmit = async () => {
    const res = await request<PutStudentIDParams, PutStudentIDResults>(`insertStudentID`, {
      studentID: insertedStudentID,
    })
    if (res) {
      dispatch(updateStudentID(insertedStudentID))
      push('/')
    }
  }
  return (
    <Sheet>
      <Header>Please Enter Your Student ID</Header>
      <InputSection>
        <TextInput placeholder="Enter Student ID" onChange={inputChange} />
        <FillBtn onClick={onSubmit}>Submit</FillBtn>
      </InputSection>
    </Sheet>
  )
}

const Header = styled.div`
  ${typography.hLabel};
`

const InputSection = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 12px;
`
