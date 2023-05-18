import {Pressable, StyleSheet, Text, View} from 'react-native'
import React, {useMemo, useState, useEffect} from 'react'
import {
  ChannelPreviewMessage,
  ChannelPreviewMessengerProps,
  ChannelPreviewTitle,
  ChannelPreviewUnreadCount,
  Check,
  CheckAll,
  LatestMessagePreview,
  useChannelPreviewDisplayName,
  useTheme,
} from 'stream-chat-react-native'
import {StreamChannel, useAppContext} from '../../App'
import {useNavigation} from '@react-navigation/native'
import {colors} from '../../theme'
import {flex, sizes} from '../../global'
import Muted from '../../icons/Muted'
import Pinned from '../../icons/Pin'
import SuperAvatar from '../SuperAvatar'
import PeekabooView from '../PeekabooView'
import Mic from '../../icons/Mic'
import {get} from 'lodash'
import moment from 'moment'
import {parseDurationTextToMs} from '../../utils/conversion'
import {ROOT_STACK} from '../../stacks/RootStack'
import {StackNavigationProp} from '@react-navigation/stack'
import {StackNavigatorParamList} from '../../types'
import { DMAvatar } from '../DMAvatar'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { chatClient} from '../../client'


export default ({
  channel,
  //latestMessagePreview,
  //formatLatestMessageDate,
}: ChannelPreviewMessengerProps) => {
  const {navigate} =
    useNavigation<StackNavigationProp<StackNavigatorParamList>>()


  const {setChannel} = useAppContext()
  const {selectedChannelsForEditing, setSelectedChannelsForEditing} =
    useAppContext()
    
  const displayName = useChannelPreviewDisplayName(channel)
  const [currentChannel, setCurrentChannel] = useState(null)
  const [colorBackground, setColorBackground] = useState(colors.dark.background)
  const [channels, setChannels] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0);


  const {
    theme: {
      channelPreview: {checkAllIcon, checkIcon, date},
      colors: {grey},
    },
  } = useTheme()

  
  useEffect(() => {
    
    fetchConvos();
  }, [])

  async function fetchConvos(){
    //different channel but somehow the length is always the same
    const filters = { 
      type: 'messaging', 
      members: { $in: [chatClient?.user?.id] }, 
      chatId: channel.id, 
      typeChat: { $eq: 'convo'}
    };
    const sort = [{ last_message_at: -1 }];
    const queriedChannels = await chatClient.queryChannels(filters, sort, {});
    const channelsWithCurrent = [...queriedChannels, channel];
    setChannels(channelsWithCurrent);

     // Calculate the total unread count
     const totalUnreadCount = channelsWithCurrent.reduce((sum, chan) => {
      return sum + chan.countUnread();
    }, 0);

   
  // Update the unreadCount state
  setUnreadCount(totalUnreadCount);

  }


  useEffect(() => {
    if (currentChannel === channel.id){
      setColorBackground(colors.dark.secondary)
    } else{
      setColorBackground(colors.dark.background)
    }
  }, [currentChannel])

  const toggleChannelSelectionForEditing = (selectedChannel: StreamChannel) => {
    setSelectedChannelsForEditing(channels => {
      const existsInSelectedChannels = channels.includes(selectedChannel)
      return existsInSelectedChannels
        ? channels.filter(c => c !== selectedChannel)
        : [...channels, selectedChannel]
    })
  }
  const isSelectedForEditing = selectedChannelsForEditing.includes(channel)


 

  const handleOnPress = async () => {
       //setChannel(channel)
        
        navigate(ROOT_STACK.CONVOS, { channel:channel, channelId: channel.id});
  }


  const handleOnLongPress = () => toggleChannelSelectionForEditing(channel)

 

  return (
    <Pressable
      style={{
        ...styles.container,
        backgroundColor: colorBackground,
      }}
      onPress={handleOnPress}
      //onLongPress={handleOnLongPress}
      >
      <SuperAvatar
        channel={channel}
        //isSelected={isSelectedForEditing}
        size={32}
      />
      {/* <DMAvatar channel={channel}/> */}
      <View style={{flex: 1, marginHorizontal: sizes.l, justifyContent:'center'}}>
        {/* <ChannelPreviewTitle channel={channel} displayName={displayName} /> */}
        <CustomChannelPreviewTitle displayName={displayName}/>
      </View>
      {/* <View style={{justifyContent: 'space-between'}}>
        <View style={flex.directionRowContentEnd}>
          <PeekabooView isEnabled={isChannelMuted}>
            <View style={{marginRight: 12}}>
              <Muted pathFill={colors.dark.secondaryLight} width={14} />
            </View>
          </PeekabooView>
          <CustomChannelPreviewUnreadCount unread={unreadCount} />
          <ChannelPreviewUnreadCount channel={channel} maxUnreadCount={50} unread={unreadCount}/>
        </View>
      </View> */}
      
        
        <View style={{...flex.directionRowContentEnd, justifyContent:'center', alignItems:'center'}}>
          <View style={{marginRight:8}}>
              {/* <CustomChannelPreviewUnreadCount unread={unreadCount} /> */}
              <ChannelPreviewUnreadCount channel={channel} maxUnreadCount={50} unread={unreadCount}/>
          </View>
          {channel?.data?.isGroupChat && 
            <>
            <Ionicons name="people" size={13} color={colors.dark.secondaryLight} />
            <Text style={{color:colors.dark.secondaryLight, marginLeft: 4, fontSize:11}}>{Object.keys(channel.state.members).length}</Text>
            </>
          }
        </View>
      
    </Pressable>
  )
}

const CustomChannelPreviewTitle = ({ displayName } : {
  displayName: string
}) => {

  return (
    <Text
      numberOfLines={2}
      style={{ color: colors.dark.text, fontSize: 16, fontWeight: 'normal' }}
    >
      {displayName}
    </Text>
  );
};

const CustomChannelPreviewUnreadCount = ({unread}) => {
  if (unread === 0) {
    return null;
  }

  const circleSize = 17;

  return (
    <View
      style={{
        backgroundColor: '#3777f0',
        width: circleSize,
        height: circleSize,
        borderRadius: circleSize / 2,
        marginLeft: 6,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{color: '#0E1528', fontSize: 11}}>
        {unread > 99 ? '99+' : unread}
      </Text>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    ...flex.directionRow1,
    padding: sizes.l,
    //backgroundColor: '#0E1528',
    margin: 0,
  },
  contentContainer: {flex: 1},
  row: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 8,
  },
  statusContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {fontSize: 14, fontWeight: '700'},
  date: {
    fontSize: 12,
    marginLeft: 2,
    textAlign: 'right',
  },
  voiceMessagePreview: {
    ...flex.directionRowItemsCenter,
  },
  voiceMessagePreviewText: {
    marginHorizontal: sizes.s,
    color: colors.dark.secondaryLight,
    fontSize: 14,
  },
})
