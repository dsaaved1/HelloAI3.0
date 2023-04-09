import React, {ReactNode} from 'react';
import styled from 'styled-components/native';
import {colors} from '../common/colors/index';
import {ViewStyle} from 'react-native';

type Props = {
  children?: ReactNode;
  wrapperStyle?: ViewStyle;
};

function MenuWrapper({children, wrapperStyle}: Props) {
  return <Wrapper style={wrapperStyle}>{children}</Wrapper>;
}

export default MenuWrapper;

const Wrapper = styled.View`
  /* padding: 2.5% 5%; */
  background-color: ${colors.black};
  border-radius: 10px;
  width: 100%;
  margin-top: 6%;
  overflow: hidden;
`;
