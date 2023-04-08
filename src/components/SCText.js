import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Text } from 'react-native';
import {colors} from '../theme'

export const SCText = (props) => {
  const { onPress, style: propStyle } = props;
  const style = Array.isArray(propStyle)
    ? [
        {
          color: colors.dark.transparentPrimary,
          //fontFamily: 'Lato-Regular',
          fontSize: 16,
        },
        ...propStyle,
      ]
    : {
        color: colors.dark.text,
        //fontFamily: 'Lato-Regular',
        fontSize: 16,
        ...propStyle,
      };
  return (
    <Text onPress={onPress} style={style}>
      {props.children}
    </Text>
  );
};
