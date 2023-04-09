import React from 'react';
import {ViewStyle, TextStyle} from 'react-native';
import Row from '../containers/Row/Row';
import Spacer from '../containers/Spacer/Spacer';
import styled from 'styled-components/native';
import {colors} from '../common/colors/index';
import {T18} from '../common/Typography/index';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

type Props = {
  text?: string;
  onPress?: () => void;
  textButtonStyle?: ViewStyle;
  textStyle?: TextStyle;
  backIcon?: boolean;
};

const TextButton: React.FC<Props> = ({
  text,
  onPress,
  textButtonStyle,
  textStyle,
  backIcon,
}) => {
  return (
    <HeaderButton activeOpacity={0.7} onPress={onPress} style={textButtonStyle}>
      <Row>
        {backIcon && (
          <>
            <IoniconsIcon
              name="chevron-back-outline"
              size={22}
              color={colors.blue}
            />
          </>
        )}
        <T18 style={textStyle} color={colors.blue}>
          {text}
        </T18>
      </Row>
    </HeaderButton>
  );
};

export default TextButton;

const HeaderButton = styled.TouchableOpacity``;
