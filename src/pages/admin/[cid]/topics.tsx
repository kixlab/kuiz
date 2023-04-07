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
import { UpdateTopicInfoParams, UpdateTopicInfoResults } from '@api/admin/updateTopicInfo'
import { UpdateTopicDialog } from '@components/Dialogs/updateTopicDialog'
import { CheckDialog } from '@components/Dialogs/CheckDialog'
import { FillButton } from '@components/basic/button/Fill'
import { TextButton } from '@components/basic/button/Text'

export default function Page() {
  const isAdmin = useSelector((state: RootState) => state.userInfo.isAdmin)
  const { push, query } = useRouter()
  const cid = query.cid as string
  const [classInfo, setClassInfo] = useState<LoadClassInfoResults>()
  const [topics, setTopics] = useState<
    {
      topic: string
      optionsGoal: number
      questionsGoal: number
    }[]
  >([])

  //create update modal data
  const [modalOpen, setModalOpen] = useState(false)
  const [initialModalText, setInitialModalText] = useState<{
    topic: string
    optionsGoal: number | undefined
    questionsGoal: number | undefined
  } | null>()
  const [modalState, setModalState] = useState<'Update' | 'Create' | null>(null)
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)

  //delete modal data
  const [checkDelete, setCheckDelete] = useState(false)

  useEffect(() => {
    if (!isAdmin) {
      push('/')
    } else {
      if (cid) {
        request<LoadClassInfoParams, LoadClassInfoResults>(`admin/loadClassInfo`, { cid }).then(res => {
          if (res) {
            setClassInfo(res)
            setTopics(res.topics)
          }
        })
      }
    }
  }, [isAdmin, push, cid, setClassInfo, setTopics])

  const updateDataBaseTopics = useCallback(
    (
      topics: {
        topic: string
        optionsGoal: number
        questionsGoal: number
      }[]
    ) => {
      if (cid) {
        request<UpdateTopicInfoParams, UpdateTopicInfoResults>(`admin/updateTopicInfo`, { cid, topics }).then(res => {
          if (res) {
            setTopics(res.topics)
          }
        })
      }
    },
    [cid]
  )

  const onUpdateTopic = useCallback(
    (index: number) => {
      setModalState('Update')
      setInitialModalText(topics[index])
      setModalOpen(true)
      setCurrentIndex(index)
    },
    [setModalOpen, setModalState, setInitialModalText, topics]
  )

  const onDeleteTopic = useCallback(
    (index: number) => {
      setCurrentIndex(index)
      setInitialModalText(topics[index])
      setCheckDelete(true)
    },
    [setCurrentIndex, setInitialModalText, topics, setCheckDelete]
  )

  const onAddNewTopic = useCallback(() => {
    setModalState('Create')
    setModalOpen(true)
  }, [setModalOpen, setModalState])

  const modalSubmit = useCallback(
    (res = '', optionWeight = 0, questionWeight = 0) => {
      setModalOpen(false)
      if (
        checkDelete === false &&
        modalState === 'Update' &&
        (res.trim().length > 0 ||
          initialModalText?.optionsGoal !== optionWeight ||
          initialModalText?.questionsGoal !== questionWeight) &&
        typeof currentIndex === 'number'
      ) {
        const updatedTopicList = [...topics]
        if (res !== '') {
          updatedTopicList[currentIndex].topic = res
        }
        if (optionWeight >= 0) {
          updatedTopicList[currentIndex].optionsGoal = optionWeight
        }
        if (questionWeight >= 0) {
          updatedTopicList[currentIndex].questionsGoal = questionWeight
        }
        setTopics(updatedTopicList)
        updateDataBaseTopics(updatedTopicList)
        setCurrentIndex(null)
        setModalState(null)
        setInitialModalText(null)
        return
      } else if (modalState === 'Create' && res.trim().length > 0 && optionWeight >= 0 && questionWeight >= 0) {
        const updatedTopicList = [
          ...topics,
          {
            topic: res,
            optionsGoal: optionWeight,
            questionsGoal: questionWeight,
          },
        ]
        setTopics(updatedTopicList)
        updateDataBaseTopics(updatedTopicList)
        setModalState(null)
        return
      } else if (checkDelete === true && typeof currentIndex === 'number') {
        const updatedTopicList = [...topics]
        updatedTopicList.splice(currentIndex, 1)
        setTopics(updatedTopicList)
        updateDataBaseTopics(updatedTopicList)
        setCheckDelete(false)
        setCurrentIndex(null)
        setModalState(null)
        return
      }
    },
    [
      setModalOpen,
      modalState,
      currentIndex,
      setTopics,
      setCurrentIndex,
      setModalState,
      checkDelete,
      topics,
      updateDataBaseTopics,
      initialModalText,
    ]
  )

  return (
    <>
      {!isAdmin ? (
        <Label color="black" size={0}>
          403 Forbidden
        </Label>
      ) : (
        <Container>
          <UpdateTopicDialog
            modalState={modalOpen}
            initialText={initialModalText?.topic}
            initialOptionWeight={modalState === 'Update' ? initialModalText?.optionsGoal : undefined}
            initialQuestionWeight={modalState === 'Update' ? initialModalText?.questionsGoal : undefined}
            state={modalState}
            submit={modalSubmit}
          />
          <CheckDialog
            title="Delete Topic"
            message={`Are you sure you want to delete "${initialModalText?.topic}"`}
            modalState={checkDelete}
            btnName="Yes"
            toggleModal={modalSubmit}
            cancelModal={() => {
              setCheckDelete(!checkDelete)
            }}
          />
          <Header>{classInfo?.name}</Header>
          <Table>
            <TableHeader>
              <Col>Topic</Col>
              <Col>Update</Col>
              <Col>Delete</Col>
            </TableHeader>
            {topics?.map(
              (
                topicsWithGoals: {
                  topic: string
                  optionsGoal: number
                  questionsGoal: number
                },
                index: number
              ) => {
                return (
                  <TableRow key={index}>
                    <Col>{topicsWithGoals.topic}</Col>
                    <Col>
                      <TextButton color={palette.primary.dark} onClick={() => onUpdateTopic(index)}>
                        Update
                      </TextButton>
                    </Col>
                    <Col>
                      <TextButton color={palette.primary.dark} onClick={() => onDeleteTopic(index)}>
                        Delete
                      </TextButton>
                    </Col>
                  </TableRow>
                )
              }
            )}
          </Table>
          <FillButton onClick={onAddNewTopic}>Add New Topic</FillButton>
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

const Table = styled.ul`
  li {
    border-radius: 3px;
    padding: 25px 30px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
  }
`

const Header = styled.h2`
  font-size: 26px;
  margin: 20px 0;
  text-align: center;
`

const TableHeader = styled.li`
  background-color: ${palette.primary.dark};
  color: ${palette.common.white};
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  @media all and (max-width: ${TABLET_WIDTH_THRESHOLD}px) {
    font-size: 12px;
  }
`

const TableRow = styled.li`
  background-color: ${palette.common.white};
  box-shadow: 0px 0px 9px 0px ${palette.background.dark};
`

const Col = styled.div`
  flex-basis: 33%;
  align-items: center;
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
