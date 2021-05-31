import { usePulse } from '@pulsejs/react';
import {
  Cloud,
  FileText,
  ImageSquare,
  SpeakerSimpleHigh,
  Gif,
  VideoCamera,
  Cube,
  Folder,
  LockSimple
} from 'phosphor-react';
import React, { useContext, useMemo } from 'react';
import styled from 'styled-components';
import { AppState } from '../core/state';
import { SelectedFileContext } from '../pages/FileView';
import { Directory, File as IFile } from '../types';
import { ContextMenu, MenuItem, ContextMenuTrigger, SubMenu } from 'react-contextmenu';

const { remote } = window.require('electron');

const appDataPath = remote.app.getAppPath();

export const File: React.FC<{ file?: IFile | Directory }> = (props) => {
  const selectedFile = useContext(SelectedFileContext);
  const selected = selectedFile === props.file.id;
  const file = props.file as IFile;
  return useMemo(
    () => (
      <ContextMenuTrigger id="same_unique_identifier">
        <FileWrapper onClick={() => AppState.SELECTED_FILE.set(file.id)}>
          <FileContainer selected={selected}>
            {Number(file.thumbnail) ? (
              <img
                alt={''}
                src={`file://${appDataPath}/data/thumbnails/${file.integrity_hash}.jpg`}
              />
            ) : (
              (() => {
                if (file.mime === 'directory') return <Folder />;
                if (file.file_name.endsWith('.icloud')) return <Cloud />;
                switch (file.extension) {
                  case 'png':
                    return <ImageSquare />;
                  case 'jpg':
                    return <ImageSquare />;
                  case 'jpeg':
                    return <ImageSquare />;
                  case 'mp3':
                    return <SpeakerSimpleHigh />;
                  case 'zip':
                    return <Cube />;
                  case 'mp4':
                    return <VideoCamera />;
                  case 'mov':
                    return <VideoCamera />;
                  case 'gif':
                    return <Gif />;
                  case 'encrypted':
                    return <LockSimple />;

                  default:
                    return <FileText />;
                }
              })()
            )}
            {file.extension && (
              <FileExt>
                <span>{file.extension}</span>
              </FileExt>
            )}
          </FileContainer>
          <FileName>{file?.file_name}</FileName>
          <ContextMenu id="same_unique_identifier">
            <MenuItem onClick={() => {}}>Open File</MenuItem>
            <MenuItem onClick={() => {}}>Encrypt</MenuItem>
            <MenuItem onClick={() => {}}>Compress</MenuItem>
            <MenuItem divider />
            <MenuItem onClick={() => {}}>Share</MenuItem>
            <MenuItem divider />

            <SubMenu title="Move To">
              <MenuItem onClick={() => {}}>Vault</MenuItem>
            </SubMenu>

            <MenuItem divider />
            <MenuItem onClick={() => {}}>Copy</MenuItem>
            <MenuItem onClick={() => {}}>Move to trash</MenuItem>
            <MenuItem onClick={() => {}}>Secure Delete</MenuItem>
          </ContextMenu>
        </FileWrapper>
      </ContextMenuTrigger>
    ),
    [selected, file]
  );
};

const FileExt = styled.div`
  padding: 1px 6px 5px 6px;
  border-radius: 7px;
  position: absolute;
  bottom: 3px;
  right: 3px;
  background-color: ${(props) => props.theme.background};
  opacity: 0.8;
  line-height: 17px;
  span {
    font-size: 11px;
    font-weight: 500;
  }
`;
const FileName = styled.span`
  margin-top: 5px;
  text-align: center;
  height: 20px;
  display: flex;
  font-size: 12px;
  padding: 0 2px;
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  color: ${(props) => props.theme.textFaint};
`;
const FileWrapper = styled.div`
  margin-right: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100px;
`;
const FileContainer = styled.div<{ selected: boolean }>`
  width: 100px;
  height: 100px;
  position: relative;
  overflow: hidden;
  display: flex;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  border: 1px solid ${(props) => props.theme.fileBorder};
  background-color: ${(props) => props.theme.file};
  transition: 200ms;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.fileHover};
    img {
      opacity: 0.7;
    }
  }
  svg {
    width: 30px;
    height: 30px;
    color: ${(props) => props.theme.textFaint};
  }
  img {
    transition: 200ms;
    width: 100px;
  }
  ${(props) =>
    props.selected &&
    `
    border: 1px solid ${props.theme.highlight};
    box-shadow:0 0 1px 2px ${props.theme.highlight};
  `}
`;
