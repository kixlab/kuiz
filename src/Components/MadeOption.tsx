import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const MadeOption = (props:{optionType:string}) => {
    return (
        <OptionBox>
            <RowFlex>
                <Tag id={props.optionType}>{props.optionType}</Tag>
                <div>option</div>
            </RowFlex>
            <RowFlex>
                <QSymbol>Q.</QSymbol>
                <div>What is the question?</div>
            </RowFlex>
            <RowFlex id="EditBtns">
                <DeleteBtn>Delete</DeleteBtn>
                <MoveBtn>View</MoveBtn>
            </RowFlex>
        </OptionBox>

    )
}

const OptionBox = styled.div`
    background-color: white;
    padding: 16px 24px 0px 24px;
    border-radius: 8px;
`

const RowFlex = styled.div`
    display: flex;
    flex-direction: row;
    gap: 12px;
    padding-bottom: 16px;
    ${props=>props.id === 'EditBtns' && css`
        justify-content:right;
    `}
`

const Tag = styled.div`
    color:white;
    font-size: 12px;
    padding: 4px 8px 4px 8px;
    border-radius: 6px;
    ${props=>props.id === 'Answer' && css`
        background-color: rgb(30, 144, 30);
    `}
    ${props=>props.id === 'Distractor' && css`
        background-color: rgb(220, 51, 51);
    `}
`

const QSymbol = styled.div`
    font-size: 18px;
    font-weight: 600;
    color: #919191;
`

const DeleteBtn = styled.div`
    font-weight: 500;
    color: #858585;
    cursor: pointer;
    &:hover{
        text-decoration: underline; 
    }
`

const MoveBtn = styled.div`
    font-weight: 500;
    padding-left: 8px;
    color: #1c548f;
    border-radius: 8px;
    cursor: pointer;
    &:hover{
        text-decoration: underline; 
    }
`