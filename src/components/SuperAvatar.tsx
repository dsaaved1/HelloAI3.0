import React from 'react'
import {Avatar, useChannelPreviewDisplayAvatar} from 'stream-chat-react-native'
import {StyleSheet, View} from 'react-native'
import {colors} from '../theme'
import {Check} from 'stream-chat-react-native-core/src/icons/index'
import {StreamChannel} from '../App'
import {sizes} from '../global'

import { chatClient } from '../client'
import { PresenceIndicator } from './PresenceIndicator'

export interface SuperAvatarProps {
  channel: StreamChannel
  isSelected?: boolean
  size?: number
  convo?: boolean
}

export default ({
  channel,
  isSelected = false,
  size = sizes.xl + sizes.xs,
  convo = false,
}: SuperAvatarProps) => {
  if (!channel) return null

  const otherMembers = Object.values(channel.state.members).filter(
    (m) => m.user.id !== chatClient?.user?.id,
  );


  const {image} = useChannelPreviewDisplayAvatar(channel)
  const name = channel?.data?.name
  return (
    <View style={styles.outerContainer}>
      <Avatar 
      //if its not convo render the initial letters image
      image={!convo? image : undefined} 
      name={name} size={size} />
      <View
        style={[
          styles.presenceIndicatorContainer,
          {
            borderColor: 'grey',
          },
        ]}>
          {!channel?.data?.isGroupChat && !convo &&(
            <PresenceIndicator
            backgroundTransparent={false}
            online={otherMembers[0].user.online}
          />
          )
          }
      </View>
      {isSelected && convo && (
        <View style={styles.checkWrap}>
          <Check
            pathFill={colors.dark.background}
            width={sizes.l}
            height={sizes.l}
          />
          
        </View>
      )}
      
    </View>
  )
}

const styles = StyleSheet.create({
  outerContainer: {flex: 0},
  checkWrap: {
    padding: 2,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.dark.highlighted,
   // backgroundColor: colors.dark.primaryLight,
    backgroundColor: '#3777f0',
    position: 'absolute',
    left: sizes.xl,
    top: sizes.xl,
  },
  presenceIndicatorContainer: {
    borderRadius: 100 / 2,
    //borderWidth: 3,
    bottom: 0,
    position: 'absolute',
    right: -4,
  },
})
