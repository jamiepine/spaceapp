import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
// import { createHashHistory } from 'history';
import defaultTheme from './constants/DefaultTheme.json';
import darkTheme from './constants/DarkTheme.json';

import FileView from './pages/FileView';
import SideBar from './components/Sidebar';
import { FileCollection } from './core/state';

const { ipcRenderer } = window.require('electron');

// const history = createHashHistory();
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow: hidden;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
`;

const App = () => {
  const theme = Object.assign(defaultTheme, darkTheme);

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <SideBar />
        <Router>
          <Switch>
            <Route exact path="/">
              <FileView />
            </Route>
          </Switch>
        </Router>
      </Wrapper>
    </ThemeProvider>
  );
};

export default App;
