import styled from '@emotion/styled'
import { palette } from '@styles/theme'
import { View } from './View'
import { MOBILE_WIDTH_THRESHOLD } from 'src/constants/ui'

interface Props {
  headers: string[]
  rows: (string | number | React.ReactNode)[][]
  onClickRow?: (i: number) => void
}

export const Table = View<Props>(({ headers, rows, onClickRow, ...props }) => {
  return (
    <Container {...props}>
      <TableHeader>
        {headers.map((head, i) => (
          <td key={i}>{head}</td>
        ))}
      </TableHeader>
      <TableBody>
        {rows?.map((row, i) => {
          return (
            <tr key={i} onClick={() => onClickRow?.(i)}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          )
        })}
      </TableBody>
    </Container>
  )
})

const Container = styled.table`
  width: 100%;
  @media (max-width: ${MOBILE_WIDTH_THRESHOLD}px) {
    font-size: 0.5rem;
    margin-left: 0px;
    margin-right: 0px;
    padding: 0;
  }
`

const TableHeader = styled.thead`
  color: ${palette.common.white};
  width: 100%;

  td {
    padding: 8px;
    background-color: ${palette.primaryDark};

    :first-of-type {
      border-top-left-radius: 8px;
    }

    :last-of-type {
      border-top-right-radius: 8px;
    }
  }
`

const TableBody = styled.tbody`
  tr:last-of-type {
    td:first-of-type {
      border-bottom-left-radius: 8px;
    }
    td:last-of-type {
      border-bottom-right-radius: 8px;
    }
  }

  td {
    background: white;
    padding: 8px;
  }
`
