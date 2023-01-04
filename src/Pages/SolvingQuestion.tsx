import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { SubmitReportParams, SubmitReportResults } from '../api/question/submitReport'
import { Post } from '../utils/apiRequest'

//SAMPLE OPTION LIST
const sampleOptions = ['Answer', 'Distractor1', 'Distractor2', 'Distractor3']

export function SolvingQuestion() {
  const navigate = useNavigate()
  const [options, setOptions] = useState(sampleOptions)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [answer, setAnswer] = useState<number | null>(null)

  /* CONNECTING DB AFTER FINISHING STATE CONTROL(BUILDING....)
    const qid = useParams().id;
	const cid = useParams().cid;
    /* CONNECTING DB AFTER FINISHING STATE CONTROL(BUILDING....)

    function shuffle(arr:Array<any>) {
        return [...arr].sort(() => 0.5 - Math.random())
    }

    function getMultipleRandom(arr: Array<any>, num: number) {
		const shuffled = shuffle(arr);
		return shuffled.slice(0, num);
	}

    function getShuffledOptions() {
        axios.get(`${process.env.REACT_APP_BACK_END}/question/detail/load?qid=` + qid).then((res) => {
			axios
				.get(`${process.env.REACT_APP_BACK_END}/question/load/cluster?qid=` + qid)
				.then((res2) => {
					const cluster = res2.data.cluster;
					const ans = cluster.filter((c:any) => c.representative.is_answer).map((e:any) => e.representative);
					const dis = cluster.filter((c:any) => !c.representative.is_answer).map((e:any) => e.representative);
					const ansList = getMultipleRandom(ans, 1);
					const disList = getMultipleRandom(dis, 3);

                    ansRef.current = ans;
					setOptions(shuffle(ansList.concat(disList)));
				})
				.catch((err) => console.log(err));
            setQInfo(res.data.qinfo);
		});
        setSelectedOption('');
    }
    */

  useEffect(() => {
    setAnswer(0)
  }, [])

  const submit = useCallback(() => {
    //DEMO VALUE FOR SIMULATING
    if (selectedOption == answer) {
      alert('CORRECT!')
      setIsAnswered(true)
    } else console.log('WRONG')
  }, [])

  const report = useCallback(async () => {
    // TODO: Needs to put actual uid and comments
    await Post<SubmitReportParams, SubmitReportResults>('submitReport', {
      uid: 'FAKE_UID',
      comment: 'FAKE_COMMENT',
    })
  }, [])

  const clickOption = useCallback(
    (i: number) => () => {
      if (isAnswered == false) {
        setSelectedOption(i)
      }
    },
    []
  )

  const shuffle = useCallback(() => {
    setOptions([...options].sort(() => Math.random() - 0.5))
    setSelectedOption(null)
  }, [])

  return (
    <QuestionBox>
      <ReturnBtn onClick={() => navigate('/')}>
        <FontAwesomeIcon icon={faArrowLeft} /> Return to Question List
      </ReturnBtn>
      <Label>Q. What is the question?</Label>
      <div>
        {options.map((e, i) => {
          return (
            <Option onClick={clickOption(i)} state={isAnswered} selected={selectedOption === i} key={i}>
              {e}
            </Option>
          )
        })}
      </div>
      <BtnDisplay>
        {isAnswered == false ? (
          <>
            <FillBtn onClick={submit}>Submit</FillBtn>
            <StrokeBtn onClick={shuffle}>Shuffle Answers</StrokeBtn>
            {/* FOR NOW, SHUFFLING FUNCTION IS A SAMPLE FUNCTION */}
          </>
        ) : (
          <FillBtn>Add Option</FillBtn>
        )}
        <StrokeBtn onClick={report}>Report Question Error</StrokeBtn>
      </BtnDisplay>
    </QuestionBox>
  )
}

const QuestionBox = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin: 30px;
  @media (max-width: 599px) {
    margin: 30px 0 30px 0;
  }
`

const ReturnBtn = styled.div`
  cursor: pointer;
  font-weight: 500;
  color: #616161;
  :hover {
    color: #919191;
  }
`

const Label = styled.div`
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
  padding: 8px 0 0 0;
  @media (max-width: 599px) {
    font-size: 16px;
    padding: 0px;
  }
`

const Option = styled.div<{ state: boolean; selected: boolean }>`
  ${({ state, selected }) => css`
    background-color: #e9eef4;
    padding: 16px;
    margin-bottom: 8px;
    border-radius: 6px;
    border: 1.5px solid rgba(0, 0, 0, 0);

    ${!state &&
    css`
      :hover {
        background-color: #d4e4f3;
        cursor: pointer;
      }
    `}
    @media (max-width: 599px) {
      font-size: 13px;
    }

    ${selected &&
    css`
      border-color: #3d8add;
      color: #3372b6;
      font-weight: 500;
      background-color: #d4e4f3;
    `}
  `}
`

const BtnDisplay = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`
const FillBtn = styled.button`
  @media (max-width: 599px) {
    font-size: 14px;
  }
`

const StrokeBtn = styled.button`
  color: #212121;
  background-color: #fff;
  border: 1px solid #858585;
  :hover {
    background-color: #e9eef4;
  }
  @media (max-width: 599px) {
    font-size: 14px;
  }
`
