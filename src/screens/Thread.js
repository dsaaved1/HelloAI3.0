import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, ActivityIndicator, SafeAreaView, StyleSheet, Text } from "react-native";
// import {
//   ChannelBackgroundWrapper,
//   ChannelHeader,
//   WhatsAppChannelWrapper,
//   RenderNothing,
// } from "your-custom-components";
import ChannelBackgroundWrapper from '../utils/ChannelBackgroundWrapper'
import {
  Channel,
  MessageList,
  useMessageContext,
  Thread
} from "stream-chat-react-native";
import { useAppContext } from "../App";
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import {myMessageTheme} from '../theme'
import RenderNothing from '../components/RenderNothing'
import Reply from '../components/channel/Reply'
import {isEmpty} from 'lodash'
import MessageContent from '../components/channel/MessageContent'
import MessageText from '../components/channel/MessageText'
import VoiceMessageAttachment from '../components/channel/VoiceMessageAttachment'
import { ModalScreenHeader } from '../components/ModalScreenHeader';
import { getChannelDisplayName } from '../utils/channelUtils';
import { truncate } from '../utils';
import { chatClient } from "../client";
import MessageInput from '../components/channel/MessageInput'
import { colors } from '../theme';
import ChannelHeader from '../components/channel/ChannelHeader';


const styles = StyleSheet.create({
    //flex1 here made disappearing messages work
    channelScreenContainer: { flexDirection: 'column', height: '100%', },
    chatContainer: {
      flexGrow: 1,
      flexShrink: 1,
      flex: 1
    },
    container: {
      backgroundColor: 'white',
      flex: 1,
    },
    drawerNavigator: {
      backgroundColor: '#3F0E40',
      width: 350,
    },
    touchableOpacityStyle: {
      alignItems: 'center',
      backgroundColor: '#3F0E40',
      borderColor: 'black',
      borderRadius: 30,
      borderWidth: 1,
      bottom: 80,
      height: 50,
      justifyContent: 'center',
      position: 'absolute',
      right: 20,
      width: 50,
    },
  });


export const ThreadsBaby = ({route}) => {
  const navigation = useNavigation();

  const {channel} = route?.params || {};
  const {channelId} = route?.params || {};
  const {solved} = route?.params || {};
  const {mainChannel} = route?.params || {};


  if (!channel) return <RenderNothing />

 
  //problem with threads 
  //it only accepts send message by input ref
  //has a big padding that is probably nothing you can do 


  return (
  
      
      ///this is the CORRECT ONE!!!!!
        <View style={styles.channelScreenContainer}>
          {/* <ModalScreenHeader
            //somehow channel.data.name is not giving the channel name updated
            goBack={navigation.goBack}
            subTitle={truncate(channelName, 35)}
            title={truncate(channelName, 35)? truncate(channelName, 35) : 'Thread'}
          /> */}
          <ChannelHeader oldChannel={mainChannel} solved={solved} />
          <ChannelBackgroundWrapper
            channelId={channelId}
            style={{flex:1}}
          >
            {/* <View
            style={[
              styles.chatContainer,
              {
                backgroundColor: colors.dark.background,
              },
            ]}> */}
               <Channel
                Card={VoiceMessageAttachment}
                MessageAvatar={RenderNothing}
                ReactionList={RenderNothing}
                channel={channel}
                //THIS GIVES THREADS
                //MessageReplies={RenderNothing}
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
                //onLongPressMessage={handleToggleMessageSelection}
                MessageContent={MessageContent}
                InlineUnreadIndicator={RenderNothing}
                initialScrollToFirstUnreadMessage={true}
                //{...props}
                >
              <MessageList
              />
            <MessageInput />
            </Channel>
       
            
            </ChannelBackgroundWrapper>
        </View>
      

  );

  // return (
  //   <SafeAreaView
  //   style={{
  //     backgroundColor: '#1C2338',
  //   }}>
  //   <BottomSheetModalProvider>
  //     <View style={styles.channelScreenContainer}>
  //       <ModalScreenHeader
  //         goBack={navigation.goBack}
  //         subTitle={truncate(getChannelDisplayName(channel, true), 35)}
  //         title={'Thread'}
  //       />
      
  //    <ChannelBackgroundWrapper
  //     channelId={channelId}
  //     style={{backgroundColor: '#0E1528' , flex: 1}}>
  //        <Channel
  //           Card={VoiceMessageAttachment}
  //           MessageAvatar={RenderNothing}
  //           ReactionList={RenderNothing}
  //           channel={channel}
  //           //THIS GIVES THREADS
  //           MessageReplies={RenderNothing}
  //           MessageFooter={RenderNothing}
  //           MessageText={MessageText}
  //           keyboardVerticalOffset={0}
  //           Reply={() => {
  //               const {
  //               message: {quoted_message: quotedMessage},
  //               } = useMessageContext()
  //               return (
  //               <Reply
  //                   isEnabled={!isEmpty(quotedMessage)}
  //                   isPreview={false}
  //                   message={quotedMessage}
  //               />
  //               )
  //           }}
  //           //colors of the message bubble
  //           myMessageTheme={myMessageTheme}
            
  //           ShowThreadMessageInChannelButton={RenderNothing}
  //           //InputButtons={RenderNothing}
  //           //SendButton={RenderNothing}
  //           onLongPressMessage={handleToggleMessageSelection}
  //           MessageContent={MessageContent}
  //           //Input={RenderNothing}
  //           //{...props}
  //           //this enables threads
  //           thread={thread}
  //           threadList>
  //       <Thread />
       
       
  //     <MessageInput
  //     //thread id is the message id
  //     //this doesn't go to message input with thread
  //      newChannel={threadId}/>
  //   </Channel>
  //   </ChannelBackgroundWrapper>
  //   </View>
  //   </BottomSheetModalProvider>
  //   </SafeAreaView>
  // );
};