import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import GroupInfo from '../Screens/GroupInfo';
import Settings from '../Screens/Settings';
import AddParticipants from '../Screens/AddParticipants';

type Props = {};

function MainStack({}: Props) {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="GroupInfo" component={GroupInfo} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="AddParticipants" component={AddParticipants} />
    </Stack.Navigator>
  );
}

export default MainStack;
