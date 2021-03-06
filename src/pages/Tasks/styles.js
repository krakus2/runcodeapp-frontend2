import styled from 'styled-components'

import { addAlphaChannel } from 'utils'

export const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.backgroundColor};
  min-height: 100%;

  ul {
    padding: 0;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  h3 {
    padding: 30px 0 15px 0;
  }
`

export const Line = styled.li`
  font-size: 20px;
  display: block;
  width: 200px;
  padding: 5px;
  margin: 15px 0;
  text-align: center;
  border-bottom: 1px solid ${(props) => props.theme.inputBorderColor};
  transition: all 0.15s ease;
  @media (hover) {
    :hover {
      cursor: pointer;
      transform: scale(1.07);
      opacity: 1.1;
      background-color: ${(props) =>
        addAlphaChannel(props.theme.primaryColor, '0.25')};
    }
  }
`

export const LoaderWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
`
