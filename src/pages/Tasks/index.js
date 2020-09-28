import React, { useState, useEffect } from 'react'

import { useMatchMedia } from 'hooks'
import { api } from 'utils'

import { Line, Wrapper, LoaderWrapper } from './styles'

const Tasks = ({ history }) => {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const result = await api({
        url: `/tests`,
        method: 'get',
      })

      setTasks(result.data)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  {
    const { isMobile } = useMatchMedia()

    return (
      <Wrapper isMobile={isMobile}>
        <h3>Lista dodanych zadań</h3>
        {isLoading ? (
          <LoaderWrapper>
            <p
              style={{
                textAlign: 'center',
                fontSize: '24px',
                fontWeight: '700',
                margin: '20px 0',
              }}
            >
              Ładowanie trwa...
            </p>
          </LoaderWrapper>
        ) : (
          <ul>
            {tasks.map(
              ({ id, ...rest }) =>
                console.log({ rest }) || (
                  <Line
                    key={id}
                    onClick={() => history.push(`/task?task_id=${id}`)}
                  >
                    ID Zadania - {id}
                  </Line>
                )
            )}
          </ul>
        )}
      </Wrapper>
    )
  }
}

export default Tasks
