import React from 'react';
import styled from 'styled-components';
import SideBarButton from './SidebarButton';
import {
  Cube,
  CirclesFour,
  Note,
  ImageSquare,
  User,
  GearSix,
  ClockClockwise,
  HourglassSimple
} from 'phosphor-react';
import { usePulse } from '@pulsejs/react';
import { AppState } from '../core/state';

const RenderButton: React.FC<{ id: string; icon: any; name: string }> = (props) => {
  const currentTab = usePulse(AppState.CURRENT_TAB);

  return (
    <SideBarButton
      onPress={() => AppState.CURRENT_TAB.set(props.id)}
      selected={currentTab === props.id}
      icon={props.icon}
    >
      {props.name}
    </SideBarButton>
  );
};

const SideBar: React.FC = (props) => {
  return (
    <SideBarContainer>
      <SideBarCategoryTitle>YOUR SPACE</SideBarCategoryTitle>
      <RenderButton id="spaces" name="Spaces" icon={CirclesFour} />
      <RenderButton id="storage" name="Storage" icon={Cube} />
      <RenderButton id="files" name="Files" icon={Note} />
      <RenderButton id="media" name="Media" icon={ImageSquare} />
      <RenderButton id="people" name="People" icon={User} />
      <RenderButton id="recents" name="Recents" icon={ClockClockwise} />
      <RenderButton id="legacy" name="Legacy" icon={HourglassSimple} />
      <RenderButton id="settings" name="Settings" icon={GearSix} />
      <SideBarCategoryTitle>PINS</SideBarCategoryTitle>
    </SideBarContainer>
  );
};

const SideBarContainer = styled.div`
  min-width: 210px;
  height: 100vh;
  border-right: 1px solid ${(props) => props.theme.borderDark};
  background-color: ${(props) => props.theme.sidebar};
`;
const SideBarCategoryTitle = styled.p`
  color: ${(props) => props.theme.textFaint};
  margin: 5px 15px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 10px;
  margin-top: 20px;
`;

export default SideBar;
