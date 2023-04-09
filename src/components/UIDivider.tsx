import React from 'react';
import styled from 'styled-components/native';
import {colors} from '../common/colors/index';
import {ViewStyle} from 'react-native';

type Props = {
  marginHorizontal?: number;
  forMenu?: boolean;
  forContacts?: boolean;
  forPlaintext?: boolean;
  style?: ViewStyle;
};

const UIDivider: React.FC<Props> = ({
  marginHorizontal,
  forMenu,
  forContacts,
  forPlaintext,
  style,
}) => {
  return (
    <Default
      style={[{marginHorizontal: marginHorizontal}, style]}
      forMenu={forMenu}
      forContacts={forContacts}
      forPlainText={forPlaintext}
    />
  );
};

export default UIDivider;

const Default = styled.View<{
  forMenu?: boolean;
  forContacts?: boolean;
  forPlainText?: boolean;
}>`
  height: 1px;
  background-color: ${colors.deepGray};
  width: ${props =>
    props.forMenu
      ? '84%'
      : props.forContacts
      ? '79%'
      : props.forPlainText
      ? '95%'
      : '100%'};
  margin-left: auto;
`;
