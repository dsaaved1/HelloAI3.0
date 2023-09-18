// import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
// import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
// import React, {
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'react';
// import { SafeAreaView, StyleSheet, View, Text } from 'react-native';

// import { CustomKeyboardCompatibleView } from '../components/CustomKeyboardCompatibleView';
// import { Gallery } from '../components/Gallery';
// import { InputBoxThread } from '../components/Input/InputBoxThread';
// import { MessageActionSheet } from '../components/MessageActionSheet/MessageActionSheet';
// import { MessageAvatar } from '../components/MessageAvatar';
// import { MessageFooter } from '../components/MessageFooter';
// import { MessageHeader } from '../components/MessageHeader';
// import { MessageRepliesAvatars } from '../components/MessageRepliesAvatars';
// import { MessageText } from '../components/MessageText';
// import { ModalScreenHeader } from '../components/ModalScreenHeader';
// import { ReactionPickerActionSheet } from '../components/ReactionPickerActionSheet/ReactionPickerActionSheet';
// import { RenderNothing } from '../components/RenderNothing';
// import { UrlPreview } from '../components/UrlPreview';
// import { SlackAppContext } from '../contexts/SlackAppContext';
// import { truncate } from '../utils';
// import { chatClient } from '../client';
// import { getChannelDisplayName } from '../utils/channelUtils';
// import { getSupportedReactions } from '../utils/supportedReactions';
// import { useAppContext } from '../App';
// import {Chat, OverlayProvider, ThemeProvider} from 'stream-chat-react-native'
// import { Channel, Thread } from 'stream-chat-react-native';

// const supportedReactions = getSupportedReactions();

// const styles = StyleSheet.create({
//   channelScreenContainer: { flexDirection: 'column', height: '100%' },
//   chatContainer: {
//     flexGrow: 1,
//     flexShrink: 1,
//   },
//   container: {
//     backgroundColor: 'white',
//     flex: 1,
//   },
//   drawerNavigator: {
//     backgroundColor: '#3F0E40',
//     width: 350,
//   },
//   touchableOpacityStyle: {
//     alignItems: 'center',
//     backgroundColor: '#3F0E40',
//     borderColor: 'black',
//     borderRadius: 30,
//     borderWidth: 1,
//     bottom: 80,
//     height: 50,
//     justifyContent: 'center',
//     position: 'absolute',
//     right: 20,
//     width: 50,
//   },
// });


// const ThreadScreen = () => {
//   const navigation = useNavigation();
//   const {
//     params: { channelId = null, threadId = null },
//   } = useRoute();
//   const { colors } = useTheme();

//   const {
//     channel,
//     setChannel,
//     //setActiveMessage,
//   } = useAppContext();
//   const [isReady, setIsReady] = useState(false);
//   const [thread, setThread] = useState();
//   const [actionSheetData, setActionSheetData] = useState(null);
//   const actionSheetRef = useRef(null);
//   const reactionPickerRef = useRef(null);

//   // const additionalTextInputProps = useMemo(
//   //   () => ({
//   //     placeholder:
//   //       channel && channel.data.name
//   //         ? 'Message #' + channel.data.name.toLowerCase().replace(' ', '_')
//   //         : 'Message',
//   //     placeholderTextColor: '#979A9A',
//   //   }),
//   //   [channel],
//   // );

//   // const openReactionPicker = useCallback(() => {
//   //   reactionPickerRef.current?.present();
//   // }, []);

//   // const onLongPressMessage = ({ actionHandlers, message }) => {
//   //   //setActiveMessage(message);
//   //   setActionSheetData({
//   //     actionHandlers,
//   //     openReactionPicker,
//   //   });
//   //   actionSheetRef.current?.present();
//   // };

//   // const renderMessageFooter = () => (
//   //   <MessageFooter openReactionPicker={openReactionPicker} />
//   // );

//   const renderMessageText = (props) => (
//     <MessageText isThreadMessage {...props} />
//   );

//   useEffect(() => {

//     try {
//       const getThread = async () => {
//         if (!channelId) {
//           navigation.goBack();
//           return;
//         }
  
//         const newChannel = chatClient.channel('messaging', channelId);
//         const res = await chatClient.getMessage(threadId);
//         await newChannel.getReplies(threadId);
  
//         setChannel(newChannel);
//         setIsReady(true);
//         setThread(res.message);
//       };
  
//       getThread();
//     } catch (error) {
//       console.log(error);
//     }
//   }, [channelId, threadId]);

//   if (!isReady) {
//     return null;
//   }

//   // return (
//   //   <SafeAreaView
//   //     style={{  
//   //       backgroundColor: "skyblue",
//   //     }}>
//   //       <Text style={{fontSize:50}}>{channelId}</Text>
//   //       <Text style={{fontSize:20}}>{threadId}</Text>
//   //   </SafeAreaView>
//   // )

// return (
//     <SafeAreaView
//       style={{
//         backgroundColor: '#1C2338',
//       }}>
//       <BottomSheetModalProvider>
//         <View style={styles.channelScreenContainer}>
//           <ModalScreenHeader
//             goBack={navigation.goBack}
//             subTitle={truncate(getChannelDisplayName(channel, true), 35)}
//             title={'Thread'}
//           />
//           <View
//             style={[
//               styles.chatContainer,
//               {
//                 backgroundColor: 'white',
//               },
//             ]}>
           
        
//             <Channel
//               //additionalTextInputProps={additionalTextInputProps}
//               animatedLongPress={false}
//               channel={channel}
//               forceAlignMessages={'left'}
//               //Gallery={Gallery}
//               //Input={InputBoxThread}
//               //KeyboardCompatibleView={CustomKeyboardCompatibleView}
//               MessageAvatar={MessageAvatar}
//               MessageDeleted={RenderNothing}
//               MessageFooter={renderMessageFooter}
//               MessageHeader={MessageHeader}
//               //MessageRepliesAvatars={MessageRepliesAvatars}
//               MessageText={renderMessageText}
//               onLongPressMessage={onLongPressMessage}
//               onPressInMessage={RenderNothing}
//               //ReactionList={RenderNothing}
//               //ShowThreadMessageInChannelButton={RenderNothing}
//               supportedReactions={supportedReactions}
//               thread={thread}
//               //UrlPreview={UrlPreview}
//               threadList>
//               <Thread />
//             </Channel>
//             {/* <MessageActionSheet {...actionSheetData} ref={actionSheetRef} /> */}
//             {/* <ReactionPickerActionSheet ref={reactionPickerRef} /> */}
//           </View>
//         </View>
//       </BottomSheetModalProvider>
//     </SafeAreaView>
//   );
// };

// export default ThreadScreen