import { useTheme } from '@react-navigation/native';
import Dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {capitalize, get, isEmpty} from 'lodash'
import { SCText } from './SCText';
import { chatClient } from '../client';
import {colors} from '../theme'

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
  },
  header: {
    paddingLeft: 2,
  },
  messageDate: {
    color: 'grey',
    fontSize: 10,
    marginLeft: 6,
  },
  messageUserName: {
    //fontFamily: 'Lato-Bold',
    fontSize: 12,
    fontWeight: '700',
  },
  userBar: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 5,
  },
});
const USER_COLORS = [
  // '#d968b0',
  // '#0091aa',
  // '#d2290a',
  // '#559800',
  // '#52a1f3',
  // '#14c796',
  // '#ff512c',
  // '#ff6300',
  // '#a18df6',
  // '#7c64f5',
  // '#00a400',
  '#50E3C2', // Teal
  '#7ED321', // Lime Green
  '#4A90E2', // Sky Blue
  '#E95D5D', // Soft Red
  '#FF6347', // Tomato
  '#40E0D0', // Turquoise
  '#ADFF2F', // GreenYellow
  '#FFD700', // Gold
  '#FF69B4', // HotPink
  '#1E90FF', // DodgerBlue
  '#32CD32', // LimeGreen
  '#FFA500', // Orange
  '#9370DB', // MediumPurple
  '#48D1CC', // MediumTurquoise
  '#F0E68C', // Khaki
  '#FA8072', // Salmon
  '#6B8E23', // OliveDrab
  '#BA55D3', // MediumOrchid
  '#5F9EA0', // CadetBlue
]

const userIdToColorLookUp = {};
const generateRandomColor = () =>
  USER_COLORS[Math.round(Math.random() * (USER_COLORS.length - 1))]

const calculateUserColor = (userId) => {
  if (!userId) return USER_COLORS[0]
  const assignedColor = get(userIdToColorLookUp, userId)
  if (assignedColor) return assignedColor
  userIdToColorLookUp[userId] = generateRandomColor()
  return userIdToColorLookUp[userId]
}


export const MessageUserBar = React.memo(({ message }) => {
  //const { colors } = useTheme();
  const {user} = message
    return (
      <>
        {user.id !== chatClient.user.id && 
        <View style={styles.userBar}>
          <SCText
            style={[
              styles.messageUserName,
              {
                color: colors.dark.secondaryLight,
               //color: calculateUserColor(user.id),
              },
            ]}>
            {message.user.name}
          </SCText>
        </View>
      }
      </>
    );
 
});

export const MessageHeader = React.memo(({ message }) => (
  <View style={styles.column}>
    
      <View style={styles.header}>
        <MessageUserBar message={message} />
      </View>
  
  </View>
));
