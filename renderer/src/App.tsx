import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import {
  HashRouter as Router,
  Switch,
  Route,
  useLocation,
  Redirect,
  withRouter
} from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import defaultTheme from './constants/DefaultTheme.json';
// import blackTheme from './constants/BlackTheme.json';
import darkTheme from './constants/DarkTheme.json';
import FileView from './pages/FileView';
import { WelcomeScreen } from './pages/WelcomeScreen';

function App() {
  return (
    <Router>
      <SwitchStack />
    </Router>
  );
}

const SwitchStack = () => {
  let location = useLocation();
  const theme = Object.assign(defaultTheme, darkTheme);

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Router>
          <TransitionGroup>
            <CSSTransition
              timeout={300}
              key={location.pathname}
              // unmountOnExit
              classNames="page"
            >
              <Switch location={location}>
                <Route path="/welcome" children={<WelcomeScreen />} />
                <Route path="/files" children={<FileView />} />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        </Router>
      </Container>
    </ThemeProvider>
  );
};

export default App;

const Container = styled.div`
  width: 100%;
  overflow: hidden;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  /* flex-direction: column; */
`;
