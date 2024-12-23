import { usePulse } from '@pulsejs/react';
import React, { createContext, useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { HeaderBar } from '../components/HeaderBar';
import { File } from '../components/File';
import { AppState, FileCollection } from '../core/state';
import '../database';
import SideBar from '../components/Sidebar';

globalThis.FileCollection = FileCollection;

export const SelectedFileContext = createContext(null);

const Main = () => {
  const files = usePulse(FileCollection.getGroup('default'));
  const selected = usePulse(AppState.SELECTED_FILE);

  return (
    <FileViewContainer>
      <SideBar />
      <SelectedFileContext.Provider value={selected}>
        <ContentContainer>
          <HeaderBar />
          {/* <EncryptedBar /> */}
          {useMemo(() => {
            return (
              <Content>
                {files.map((file) => {
                  return <File key={file.id} file={file} />;
                })}
              </Content>
            );
          }, [files])}
        </ContentContainer>
      </SelectedFileContext.Provider>
    </FileViewContainer>
  );
};

export default withRouter(Main);

const FileViewContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  height: 100vh;
`;
const ContentContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  flex-grow: 1;
  width: 80%;
`;

const Content = styled.div`
  font-size: 20px;
  padding: 15px;
  display: flex;
  flex-wrap: wrap;
  overflow-y: scroll;
  overflow-x: hidden;
`;
