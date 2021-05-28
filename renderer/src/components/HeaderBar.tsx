import { usePulse } from '@pulsejs/react';
import {
  CaretLeft,
  CaretRight,
  Columns,
  List,
  SquaresFour,
  Repeat,
  Key,
  LockSimpleOpen,
  HouseSimple
} from 'phosphor-react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { File as IFile } from '../types';
import { AppState, FileCollection } from '../core/state';
import { SearchBox } from './SearchBox';
import { Link } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');

export const HeaderBar: React.FC = (props) => {
  const [selected, setSelected] = useState(0);
  const selectedFile = usePulse(AppState.SELECTED_FILE);
  const file = FileCollection.getDataValue(selectedFile);

  function encrypt() {
    if (file) {
      ipcRenderer.send('encrypt', {
        type: 'encrypt',
        file,
        password: '123456'
      });
    }
  }
  function decrypt() {
    if (file) {
      ipcRenderer.send('encrypt', {
        type: 'decrypt',
        file,
        password: '123456'
      });
    }
  }
  return (
    <HeaderBarContainer>
      <RightButtonArea>
        <Link to="/">
          <RightButtonContainer style={{ marginRight: 1 }}>
            <HouseSimple />
          </RightButtonContainer>
        </Link>
      </RightButtonArea>
      <RightButtonArea>
        <RightButtonContainer style={{ marginRight: 1 }}>
          <CaretLeft />
        </RightButtonContainer>
        <RightButtonContainer>
          <CaretRight />
        </RightButtonContainer>
      </RightButtonArea>
      <Title>Documents</Title>
      <div style={{ flexGrow: 1 }} />
      <SearchBox />
      <RightButtonArea>
        <RightButtonContainer onClick={() => setSelected(0)} selected={selected === 0}>
          <SquaresFour />
        </RightButtonContainer>
        <RightButtonContainer onClick={() => setSelected(1)} selected={selected === 1}>
          <List />
        </RightButtonContainer>
        <RightButtonContainer onClick={() => setSelected(2)} selected={selected === 2}>
          <Columns />
        </RightButtonContainer>
      </RightButtonArea>
      <div style={{ width: 130 }} />
      <div style={{ flexGrow: 1 }} />
      {selectedFile && (
        <RightButtonArea>
          {(file as IFile)?.encryption_method ? (
            <RightButtonContainer onClick={decrypt} style={{ marginRight: 5 }}>
              <LockSimpleOpen />
            </RightButtonContainer>
          ) : (
            <RightButtonContainer onClick={encrypt} style={{ marginRight: 5 }}>
              <Key />
            </RightButtonContainer>
          )}
        </RightButtonArea>
      )}
      <RightButtonArea>
        <RightButtonContainer
          onClick={() => ipcRenderer.send('scan', { directory: '/Users/jamie/Desktop/Junk' })}
          style={{ marginRight: 10 }}
        >
          <Repeat />
        </RightButtonContainer>
      </RightButtonArea>
    </HeaderBarContainer>
  );
};

const Title = styled.h2`
  font-size: 20px;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: -1px;
`;

const RightButtonContainer = styled.div<{ selected?: boolean }>`
  background-color: ${(props) => props.theme.headerButtonFaint};
  border: 1px solid transparent;
  display: flex;
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  -webkit-app-region: no-drag;
  color: ${(props) => props.theme.text};
  &:hover {
    background-color: ${(props) => props.theme.headerButton};
  }
  svg {
    width: 19px;
    height: 19px;
  }
  ${(props) =>
    props.selected &&
    `
      background-color: ${props.theme.headerButton} !important;
      border: 1px solid ${props.theme.headerBorder};
  `}
`;
const RightButtonArea = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 10px;
  div:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  div:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`;
const HeaderBarContainer = styled.div`
  min-height: 50px;

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.borderDark};
  background-color: ${(props) => props.theme.headerBackground};
  -webkit-user-select: none;
  -webkit-app-region: drag;
`;
