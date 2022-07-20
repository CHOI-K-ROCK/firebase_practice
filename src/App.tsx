import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { useDispatch, useSelector } from 'react-redux';

import { globalStateActions } from './redux_modules/globalState';

const Container = styled.section``;

const GlobalStyles = createGlobalStyle`
    ${reset}

    a {
      color: #000;
    }

    button {
      color: #000;
    }
  `;

function App(): JSX.Element {
  const globalState = useSelector(
    (state: { globalState: { value: string } }) => state.globalState
  );
  const dispatch = useDispatch();

  return (
    <>
      <GlobalStyles />
      <Container>
        <div>{globalState.value ? globalState.value : 'empty'}</div>
        <input
          onChange={(e) => dispatch(globalStateActions.change(e.target.value))}
        />
      </Container>
    </>
  );
}

export default App;
