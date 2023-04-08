import React, {ReactNode} from 'react';
import {ViewStyle} from 'react-native';

//styled
import styled from 'styled-components/native';

type Props = {
  children: ReactNode;
  rowStyle?: ViewStyle;
};

const Row: React.FC<Props> = ({children, rowStyle}) => {
  return <RowContainer style={rowStyle}>{children}</RowContainer>;
};

export default Row;

const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
