import moment from 'moment'
import {StyleSheet, Text, View} from 'react-native'
import {flex, sizes} from '../../global'
import Star from '../../icons/Star'
import {colors} from '../../theme'
import {
  MessageStatus,
  useMessageContext,
  useTheme,
  useChannelContext,
} from 'stream-chat-react-native'
import type {MessageTextProps, RenderTextParams} from 'stream-chat-react-native'
import React, {useMemo} from 'react'
import PeekabooView from '../PeekabooView'
import {StreamChatGenerics} from '../../types'
import {isEmpty, get} from 'lodash'
import { chatClient } from '../../client';


const USER_COLORS = [
  '#ff512c',
  '#7c64f5',
  '#50E3C2', // Teal
  '#7ED321', // Lime Green
  '#4A90E2', // Sky Blue
  '#E95D5D', // Soft Red
  '#FF6347', // Tomato
  '#40E0D0', // Turquoise
  '#ADFF2F', // GreenYellow
  '#FF69B4', // HotPink
  '#1E90FF', // DodgerBlue
  '#FFA500', // Orange
  '#9370DB', // MediumPurple
  '#48D1CC', // MediumTurquoise
  '#F0E68C', // Khaki
  '#FA8072', // Salmon
  '#BA55D3', // MediumOrchid
]


const generateRandomColor = () => USER_COLORS[Math.round(Math.random() * (USER_COLORS.length - 1))]

type UserIdColorLookup = { [userId: string]: string };

const userIdToColorLookUp: UserIdColorLookup = {};

const calculateUserColor = (userId: string | undefined): string => {
  if (!userId) return USER_COLORS[0];
  const assignedColor = userIdToColorLookUp[userId];
  if (assignedColor) return assignedColor;
  userIdToColorLookUp[userId] = generateRandomColor();
  return userIdToColorLookUp[userId];
};

const MessageText = ({renderText, ...props}: MessageTextProps) => {
  // const {messages} = useChannelContext()
  const {message} = useMessageContext()
  const {channel} = useChannelContext()
  const {
    theme: {
      colors: themeColors,
      messageSimple: {
        content: {markdown},
      },
    },
  } = useTheme()

  const messageCreationTime = moment(message?.created_at).format('HH:mm')
  const isMessageDeleted = useMemo(
    () => !isEmpty(message.deleted_at),
    [message.id],
  )

  const moreThanTwoUsers = () => {
    return Object.keys(channel?.state?.members).length > 2
  }

  const showSenderName = () => {
    return message?.user?.id !== chatClient?.user?.id;
  };

  const shouldShowSenderName = () => {
    if (message?.user?.id === chatClient?.user?.id) {
      return false;
    }
    
    // if (index === 0) {
    //   return true;
    // }
    
    // const previousMessage = messages[index - 1];
    // return previousMessage?.user?.id !== message?.user?.id;
  };

  return (
    <View style={{flexDirection: 'column'}}>
      {showSenderName() && moreThanTwoUsers() && (
        <Text style={{fontWeight: 'bold', 
        fontSize: 12,
        //color: colors.dark.secondaryLight, 
        color: calculateUserColor(message?.user?.id),
        marginBottom: -6, paddingVertical: 4}}>
          {message?.user?.name || message?.user?.id}
        </Text>
      )}
    <View style={flex.directionRowItemsEndContentSpaceBetween}>
      <View style={styles.textWrapper}>
        {renderText({
          ...props,
          colors: themeColors,
          markdownStyles: markdown,
        } as RenderTextParams<StreamChatGenerics>)}
      </View>
      <View style={styles.infoContainer}>
        <PeekabooView isEnabled={message?.pinned && !isMessageDeleted}>
          <Star
            pathFill={colors.dark.primaryTransparent}
            width={sizes.m}
            height={sizes.m}
            style={{marginRight: sizes.s}}
          />
        </PeekabooView>
        <Text
          style={{
            color: isMessageDeleted
              ? colors.dark.secondaryLight
              : colors.dark.primaryTransparent,
            fontSize: 12,
          }}>
          {messageCreationTime}
        </Text>
        <MessageStatus />
      </View>
    </View>
    </View>
  )
}

export default MessageText as React.ComponentType<
  MessageTextProps<StreamChatGenerics>
>

const styles = StyleSheet.create({
  textWrapper: {
    flexGrow: 1,
    flexShrink: 1,
    marginRight: sizes.sm,
  },
  infoContainer: {
    ...flex.directionRowItemsCenter,
    padding: sizes.xs,
  },
})
