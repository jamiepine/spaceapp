import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { HashRouter as Router, Switch, Route, useLocation } from 'react-router-dom';
import defaultTheme from './constants/DefaultTheme.json';
import blackTheme from './constants/BlackTheme.json';
import darkTheme from './constants/DarkTheme.json';
import { AnimatedSwitch, spring } from 'react-router-transition';
import FileView from './pages/FileView';
import { WelcomeScreen } from './pages/WelcomeScreen';

// const history = createHashHistory();
const StyledAnimatedSwitch = styled(AnimatedSwitch)`
  display: flex;
  width: 100%;
  overflow: hidden;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  flex-direction: column;
`;

const App = () => {
  const theme = Object.assign(defaultTheme, darkTheme);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <StyledAnimatedSwitch
          runOnMount
          mapStyles={mapStyles}
          atEnter={bounceTransition.atEnter}
          atLeave={bounceTransition.atLeave}
          atActive={bounceTransition.atActive}
          className="switch-wrapper"
        >
          <Route exact path="/">
            <WelcomeScreen />
          </Route>
          <Route exact path="/files">
            <FileView />
          </Route>
        </StyledAnimatedSwitch>
      </Router>
    </ThemeProvider>
  );
};

export default App;

function bounce(val) {
  return spring(val, {
    stiffness: 430,
    damping: 50
  });
}
const bounceTransition = {
  atEnter: {
    opacity: 0
  },
  atLeave: {
    opacity: bounce(0)
    // scale: bounce(0.9)
  },
  atActive: {
    opacity: bounce(1)
    // scale: bounce(1)
  }
};

function mapStyles(styles) {
  return {
    opacity: styles.opacity,
    transform: `scale(${styles.scale})`
  };
}
