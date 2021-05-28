import React from 'react';
import styled from 'styled-components';

export const SearchBox: React.FC = (props) => {
  return <SearchBoxContainer></SearchBoxContainer>;
};

const SearchBoxContainer = styled.input.attrs({
  placeholder: 'Search'
})`
  border: 1px solid ${(props) => props.theme.headerBorder};
  border-radius: 5px;
  width: 200px;
  background-color: ${(props) => props.theme.headerButton};
  height: 30px;
  outline: none;
  color: ${(props) => props.theme.text};
  font-size: 16px;
  padding: 0 10px;
  transition: 200ms;
  ::placeholder {
    color: ${(props) => props.theme.textFaint};
  }
  &:focus {
    width: 300px;
    background-color: ${(props) => props.theme.headerSearchFocus};
    /* border: 1px solid ${(props) => props.theme.borderLight}; */
  }
`;
