import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const colors = ['#1d235473', '#ff0a0a45', '#fff70a45', '#30ff0a45'];

export const WelcomeScreen: React.FC = () => {
  const [color, setColor] = useState(colors[0]);
  return (
    <WelcomeScreenContainer>
      <ContentContainer>
        <img src="logo.svg" />
        <h1>SPACE</h1>
        <span>v0.0.12</span>
        <p>Space is storage and file sharing re-imagined.</p>
        <Link to="/files">
          <button type="button">Get Started</button>
        </Link>
      </ContentContainer>
      <WelcomeScreenBG />
      <WelcomeScreenBG2 />
      <WelcomeScreenRadial color={color} />
    </WelcomeScreenContainer>
  );
};

const WelcomeScreenRadial = styled.div<{ color: string }>`
  position: absolute;
  height: 100vh;
  width: 100%;
  transition: 800ms;
  background: radial-gradient(#28285500, ${(props) => props.color});
`;
const WelcomeScreenBG2 = styled.div`
  position: absolute;
  height: 100vh;
  width: 100%;
  opacity: 0.1;
  background-image: url('bg.jpg');
  background-position: center;
  background-size: cover;
`;
const WelcomeScreenBG = styled.div`
  position: absolute;
  height: 100vh;
  width: 100%;
  filter: blur(12px);
  -webkit-filter: blur(12px);
  background-image: url('bg.jpg');
  background-position: center;
  background-size: cover;
  opacity: 0.5;
`;

const ContentContainer = styled.div`
  max-width: 600px;
  margin: auto;
  z-index: 99;
  text-align: center;
  h1 {
    margin-top: 20px;
    font-size: 50px;
  }
  p {
    margin-top: 20px;
    font-size: 20px;
  }
  span {
    opacity: 0.4;
  }
  a {
    text-decoration: none;
  }
  button {
    border-radius: 6px;
    padding: 10px 20px;
    border: 1px solid transparent;
    margin: auto;
    margin-top: 30px;
    line-height: 17px;
    font-size: 19px;
    font-weight: 600;
    cursor: pointer;
    outline: none;
    align-items: center;
    background-color: #b5cfff26;
    color: white;
    transition: 200ms;
    display: flex;
    &:hover {
      background-color: #b5cfff2f;
    }
  }
`;

const WelcomeScreenContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  background-color: #24243a;
  width: 100%;
`;
