import { Label } from '@components/basic/Label'
import { RootState } from '@redux/store'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { request } from '@utils/api'
import { LoadClassInfoParams, LoadClassInfoResults } from '@api/admin/loadClassInfo'
import styled from '@emotion/styled'
import { palette, typography } from '@styles/theme'
import { TABLET_WIDTH_THRESHOLD } from 'src/constants/ui'
import { FillBtn } from '@components/basic/button/Button'

export default function Page() {
  const isAdmin = useSelector((state: RootState) => state.userInfo.isAdmin)
  const { push, query } = useRouter()
  const cid = query.cid as string
  const [classInfo, setClassInfo] = useState<LoadClassInfoResults>()

  useEffect(() => {
    !isAdmin
      ? push('/')
      : cid
      ? request<LoadClassInfoParams, LoadClassInfoResults>(`admin/loadClassInfo`, { cid }).then(res => {
          if (res) {
            setClassInfo(res)
          }
        })
      : null
  }, [isAdmin, push, cid, setClassInfo])

  const onClick = useCallback(() => {}, [])

  return (
    <>
      {!isAdmin ? (
        <Label color="black" size={0}>
          403 Forbidden
        </Label>
      ) : (
        <Container>
          <Header>{classInfo?.name}</Header>
          <Table>
            <TableHeader>
              <Col>Information</Col>
              <Col>Count</Col>
              <Col>Detail</Col>
            </TableHeader>
            <TableRow>
              <Col>Topics</Col>
              <Col>{classInfo?.topics.length}</Col>
              <Col>
                <FillBtn onClick={onClick}>Detail</FillBtn>
              </Col>
            </TableRow>
            <TableRow>
              <Col>Students</Col>
              <Col>{classInfo?.students.length}</Col>
              <Col>
                <FillBtn onClick={onClick}>Detail</FillBtn>
              </Col>
            </TableRow>
            <TableRow>
              <Col>Questions</Col>
              <Col>{classInfo?.qstems.length}</Col>
              <Col>
                {' '}
                <FillBtn onClick={onClick}>Detail</FillBtn>
              </Col>
            </TableRow>
          </Table>
        </Container>
      )}
    </>
  )
}

const Container = styled.div`
  ${typography.b03b}
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 10px;
  padding-right: 10px;
`

const Header = styled.h2`
  font-size: 26px;
  margin: 20px 0;
  text-align: center;
`

const Table = styled.ul`
  li {
    border-radius: 3px;
    padding: 25px 30px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
  }
  @media all and (max-width: ${TABLET_WIDTH_THRESHOLD}px) {
    li {
      display: block;
    }
  }
`
const TableHeader = styled.li`
  background-color: ${palette.primary.dark};
  color: ${palette.common.white};
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  @media all and (max-width: ${TABLET_WIDTH_THRESHOLD}px) {
    display: none;
  }
`

const TableRow = styled.li`
  background-color: ${palette.common.white};
  box-shadow: 0px 0px 9px 0px ${palette.background.dark};
`

const Col = styled.div`
  flex-basis: 33%;
  @media all and (max-width: ${TABLET_WIDTH_THRESHOLD}px) {
    flex-basis: 100%;
    display: flex;
    padding: 10px 0;
    &:before {
      color: ${palette.common.white};
      padding-right: 10px;
      flex-basis: 50%;
      text-align: right;
    }
  }
`