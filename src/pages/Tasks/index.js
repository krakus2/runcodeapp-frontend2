import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { useMatchMedia } from 'hooks'

import { Line, Wrapper } from './styles'

const Tasks = ({ history }) => {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const result = await axios.get('/api/tests')

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
        <ul>
          {isLoading ? (
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
          ) : (
            tasks.map((id) => (
              <Line
                key={id}
                onClick={() => history.push(`/task?task_id=${id}`)}
              >
                ID Zadania - {id}
              </Line>
            ))
          )}
        </ul>
      </Wrapper>
    )
  }
}

export default Tasks
