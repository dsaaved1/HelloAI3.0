import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';

const styles = StyleSheet.create({
  offlineCircle: {
    backgroundColor: 'transparent',
    borderRadius: 100 / 2,
    height: 10,
    marginRight: 5,
    width: 10,
  },
  onlineCircle: {
    backgroundColor: '#53FF66',
    //'#117A58'
    borderRadius: 100 / 2,
    height: 11,
    marginRight: 5,
    width: 11,
  },
});

export const PresenceIndicator = ({ backgroundTransparent = true, online }) => {
  
  return (
    <View
      style={
        online
          ? styles.onlineCircle
          : [
              styles.offlineCircle,
              {
                backgroundColor: backgroundTransparent
                  ? 'transparent'
                  : colors.dark.background,
                borderColor: 'grey',
                borderWidth: 2,
              },
            ]
      }
    />
  );
};
