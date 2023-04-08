import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { chatClient } from '../client'
import { PresenceIndicator } from './PresenceIndicator';
import SuperAvatar from './SuperAvatar'

const styles = StyleSheet.create({
  avatarImage: {
    borderRadius: 5,
    height: 35,
    width: 35,
  },
  presenceIndicatorContainer: {
    borderRadius: 100 / 2,
    borderWidth: 3,
    bottom: -5,
    position: 'absolute',
    right: -10,
  },
  stackedAvatarContainer: {
    height: 45,
    marginTop: 5,
    width: 45,
  },
  stackedAvatarImage: {
    borderRadius: 5,
    height: 31,
    width: 31,
  },
  stackedAvatarTopImage: {
    borderWidth: 3,
    bottom: 0,
    position: 'absolute',
    right: 0,
  },
});



export const DMAvatar = ({ channel }) => {
  const { colors } = useTheme();

  const otherMembers = Object.values(channel.state.members).filter(
    (m) => m.user.id !== chatClient.user.id,
  );

  if (otherMembers.length >= 2) {
    return (
      <SuperAvatar
      channel={channel}
      
      size={38}
    />
    );
  }

  return (
    <View style={styles.avatarImage}>
      <Image
        source={{
          uri: otherMembers[0].user.image,
        }}
        style={styles.avatarImage}
      />
      <View
        style={[
          styles.presenceIndicatorContainer,
          {
            borderColor: colors.background,
          },
        ]}>
        <PresenceIndicator
          backgroundTransparent={false}
          online={otherMembers[0].user.online}
        />
      </View>
    </View>
  );
};
