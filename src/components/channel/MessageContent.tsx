import React, {useRef} from 'react'
import {Swipeable} from 'react-native-gesture-handler'
import {
  MessageContent,
  useMessageContext,
  useMessageInputContext,
  useMessagesContext,
  useChannelContext,
} from 'stream-chat-react-native'
import {StyleSheet, View, Text} from 'react-native'
import ReplyArrow from '../../icons/ReplyArrow'
import {colors} from '../../theme'
import {sizes} from '../../global'
import {useAppContext} from '../../App'
import RenderNothing from '../RenderNothing'
import AIMessage from './AIMessage'
import {MessageFooter} from '../MessageFooter'


export default ({setMessageContentWidth}: {setMessageContentWidth: any}) => {
  const swipeableRef = useRef<Swipeable | null>(null)
  const {setQuotedMessageState} = useMessagesContext()
  const {message} = useMessageContext()
  const {selectedMessageIdsEditing, messageInputRef} = useAppContext()
  const {clearQuotedMessageState} = useMessageInputContext()
  const isSelectedForEditing = selectedMessageIdsEditing.includes(message?.id)

  const renderMessageFooter = () => (
    <MessageFooter
      //goToMessage={goToMessage}
      //openReactionPicker={openReactionPicker}
    />
  );

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      containerStyle={{
        ...messageContentStyles.container,
        backgroundColor: isSelectedForEditing
          ? colors.dark.primaryLightTransparent
          : 'transparent',
      }}
      onSwipeableWillOpen={async () => {
        if (swipeableRef.current === null) return

        await new Promise(resolve => setTimeout(resolve, 250))
        clearQuotedMessageState()
        setQuotedMessageState(message)
        swipeableRef.current.close()
        messageInputRef?.current?.focus()
      }}
      renderLeftActions={() => (
        <View style={messageContentStyles.leftSwipeContainer}>
          <ReplyArrow
            pathFill={colors.dark.text}
            width={sizes.xl}
            height={sizes.xl}
          />
        </View>
      )}>
        {
        (message.class === 'AIQuestion' ||  message.isAI) ? (
          //render another type of messsage which is not a bubble
          <AIMessage 
          />
         ) : 
         <MessageContent
           setMessageContentWidth={setMessageContentWidth}
           MessageFooter={RenderNothing}
           MessageHeader={RenderNothing}
         />
      
      }
    </Swipeable>
  )
}

const messageContentStyles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius:5 ,
  },
  leftSwipeContainer: {
    height: '100%',
    padding: sizes.xl,
    justifyContent: 'center',
  },
  bottomContainer: {
    width: '100%',
    position: "absolute",
    bottom: 0,
    backgroundColor: "#1C2333",
    padding: 15,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  button: {
    borderRadius: 20,
    paddingRight: 20,
    paddingVertical: 5,
    marginBottom: 15,
  },
})
