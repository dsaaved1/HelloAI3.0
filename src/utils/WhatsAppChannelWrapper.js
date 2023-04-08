import React, {PropsWithChildren, useEffect, useState, useRef,} from 'react'
//import type {ChannelProps} from 'stream-chat-react-native'
import {
  Channel,
  MessageTouchableHandlerPayload,
  useMessageContext,
} from 'stream-chat-react-native'
import {myMessageTheme} from '../theme'
import RenderNothing from '../components/RenderNothing'
import Reply from '../components/channel/Reply'
import {isEmpty} from 'lodash'
import MessageContent from '../components/channel/MessageContent'
import MessageText from '../components/channel/MessageText'
import VoiceMessageAttachment from '../components/channel/VoiceMessageAttachment'
import {StreamChatGenerics} from '../types'
import {useAppContext} from '../App'
import { MessageFooter } from '../components/MessageFooter';
import { MessageHeader } from '../components/MessageHeader';
import { MessageAvatar } from '../components/MessageAvatar'
import { MessageRepliesAvatars } from '../components/MessageRepliesAvatars';
import { supportedReactions } from './supportedReactions'
import { ReactionPickerActionSheet } from '../components/ReactionPickerActionSheet/ReactionPickerActionSheet';
import { View } from 'react-native';
export default ({
  channel,
  ...props
}) => {

  const {setSelectedMessageIdsEditing, setActiveMessage} = useAppContext()
  const [activeThread, setActiveThread] = useState();
  const reactionPickerRef = useRef(null);

  const openReactionPicker = (message) => {
    setActiveMessage(message);
    //actionSheetRef.current?.dismiss();
    reactionPickerRef.current?.present();
  };

  const renderMessageFooter = () => (
    <MessageFooter
      // goToMessage={goToMessage}
      openReactionPicker={openReactionPicker}
    />
  );


  const handleToggleMessageSelection = ({
    message,
  }) => {
    const messageId = message?.id

    setSelectedMessageIdsEditing(ids => {
      const existsInSelectedChannels = ids.includes(messageId)

      return existsInSelectedChannels
        ? ids.filter(id => id !== messageId)
        : [...ids, messageId]
    })
  }

  useEffect(() => {
    setSelectedMessageIdsEditing([])
  }, [channel?.id, setSelectedMessageIdsEditing])

  useEffect(() => {
    return () => setSelectedMessageIdsEditing([])
  }, [])

  if (!channel) return <RenderNothing />
  

  return (
  
    <Channel
      Card={VoiceMessageAttachment}
      MessageAvatar={RenderNothing}
      ReactionList={RenderNothing}
      channel={channel}
      //THIS GIVES THREADS
      MessageReplies={RenderNothing}
      MessageText={MessageText}
      keyboardVerticalOffset={0}
      Reply={() => {
        const {
          message: {quoted_message: quotedMessage},
        } = useMessageContext()
        return (
          <Reply
            isEnabled={!isEmpty(quotedMessage)}
            isPreview={false}
            message={quotedMessage}
          />
        )
      }}
      //colors of the message bubble
      myMessageTheme={myMessageTheme}
      InputButtons={RenderNothing}
      SendButton={RenderNothing}
      onLongPressMessage={handleToggleMessageSelection}
      MessageContent={MessageContent}
      MessageHeader={channel.data.isGroupChat? MessageHeader : RenderNothing}
      {...props}

      //MessageFooter={renderMessageFooter}


      //message content gets rid message footer and all the other stuff
      //its different from slack because it takes props
      //MessageFooter={renderMessageFooter}
      // MessageAvatar={MessageAvatar}
      //MessageRepliesAvatars={MessageRepliesAvatars}
      //thread={activeThread}
      //supportedReactions={supportedReactions}
    />
    
  )
}
