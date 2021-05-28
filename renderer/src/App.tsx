import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { HashRouter as Router, Switch, Route, useLocation, Redirect } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import defaultTheme from './constants/DefaultTheme.json';
// import blackTheme from './constants/BlackTheme.json';
import darkTheme from './constants/DarkTheme.json';
import FileView from './pages/FileView';
import { WelcomeScreen } from './pages/WelcomeScreen';

function App() {
  const theme = Object.assign(defaultTheme, darkTheme);
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Container>
          <Switch>
            <Route exact path="/">
              <Redirect to="/welcome" />
            </Route>
            <Route path="*">
              <MainStack />
            </Route>
          </Switch>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

const MainStack = () => {
  let location = useLocation();

  return (
    <Router>
      <TransitionGroup>
        <CSSTransition
          timeout={300}
          key={location.key}
          unmountOnExit
          classNames={{
            appear: 'page-enter',
            appearActive: 'page-enter-active',
            // appearDone: 'my-done-appear',
            enter: 'page-enter',
            enterActive: 'page-enter-active',
            // enterDone: 'my-done-enter',
            exit: 'page-exit',
            exitActive: 'page-exit-active'
            // exitDone: 'my-done-exit',
          }}
        >
          <Switch location={location}>
            <Route path="/welcome" children={<WelcomeScreen />} />
            <Route path="/files" children={<FileView />} />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </Router>
  );
};

export default App;

const Container = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  flex-direction: column;
`;
