import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
  } from 'react';
  import {MessageList} from 'stream-chat-react-native'
  import {useAppContext} from '../App'
  import MessageInput from '../components/channel/MessageInput'
  import ChannelBackgroundWrapper from '../utils/ChannelBackgroundWrapper'
  import {colors} from '../theme'
  import {ActivityIndicator, View} from 'react-native'
  import {flex} from '../global'
  import {
    useFocusEffect,
    useNavigation,
    useRoute,
    useTheme,
  } from '@react-navigation/native';
  import { CHANNEL_STACK } from '../stacks/ChannelStack'
  import { ROOT_STACK } from '../stacks/RootStack'
  
  export const ChannelScreen2 = () => {
    const navigation = useNavigation();
    const {channel} = useAppContext()
    const {messageId} = useRoute().params || {}
  
    if (!channel) return null
  
    // const openThread = useCallback(
    //   (thread) => {
    //     setActiveThread(thread);
    //     navigation.navigate(CHANNEL_STACK.THREAD_SCREEN, {
    //       channelId: channel.id,
    //       threadId: thread.id,
    //     });
    //   },
    //   [channel?.id, messageId],
    // );
  
    const openThread = useCallback(
      (thread) => {
        navigation.navigate(CHANNEL_STACK.THREAD_SCREEN, {
          channelId: channel.id,
          threadId: thread.id,
        });
      },
      [channel?.id, messageId],
    );
  
  
    if (!channel?.initialized || !channel?.id)
      return (
        <View
          style={{
            ...flex.itemsContentCenter1,
            backgroundColor: '#0E1528',
          }}>
          <ActivityIndicator size={'large'} />
        </View>
      )
  
    return (
      <ChannelBackgroundWrapper
        channelId={channel?.id}
        style={{backgroundColor: '#0E1528' , flex: 1}}>
        <MessageList 
          onThreadSelect={openThread}
        />
        <MessageInput />
      </ChannelBackgroundWrapper>
    )
    
  }
  