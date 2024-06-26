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
import {useAppContext} from '../App'
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
      //MessageHeader={Object.keys(channel?.state.members).length > 2 ? MessageHeader: RenderNothing}
      {...props}

      MessageFooter={RenderNothing}
      //InlineUnreadIndicator={RenderNothing}
      initialScrollToFirstUnreadMessage={true}

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
