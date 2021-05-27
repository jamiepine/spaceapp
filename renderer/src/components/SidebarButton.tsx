import React from 'react';
import styled from 'styled-components';

interface SidebarButtonProps {
  selected?: boolean;
  icon?: any;
  onPress?: () => any;
}

const SideBarButton: React.FC<SidebarButtonProps> = (props) => {
  return (
    <SideBarButtonContainer onClick={props.onPress} selected={props.selected}>
      {!!props.icon && <props.icon />}
      <span>{props.children}</span>
    </SideBarButtonContainer>
  );
};

const SideBarButtonContainer = styled.div<{ selected?: boolean }>`
  border-radius: 6px;
  padding: 6px 20px;
  border: 1px solid transparent;
  margin: 5px 10px;
  cursor: pointer;
  align-items: center;
  display: flex;
  span {
    font-size: 16px;
    font-weight: 400;
  }
  svg {
    width: 20px;
    height: 20px;
    margin: 0;
    margin-right: 10px;
    margin-left: -5px;
  }
  &:hover {
    background-color: ${(props) => props.theme.buttonFaint};
  }
  ${(props) =>
    props.selected &&
    `
         background-color: ${props.theme.button} !important;
         border-color: ${props.theme.border};
    `}
`;

export default SideBarButton;
