import React from 'react';
import MainStack from './navigation/MainStack';
import {NavigationContainer} from '@react-navigation/native';
type Props = {};

function Apip({}: Props) {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}

export default Apip;
