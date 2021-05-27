import React from 'react';
import styled from 'styled-components';

export const EncryptedBar: React.FC = () => {
  return <EncryptedBarContainer></EncryptedBarContainer>;
};

const EncryptedBarContainer = styled.div`
  display: flex;
  min-height: 45px;
  width: 100%;
  background-color: #5895cc;
`;
