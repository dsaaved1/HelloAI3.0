import {Pressable, StyleSheet, Text, View} from 'react-native'
import React, {useMemo, useState, useEffect, useFocusEffect} from 'react'
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
  const unreadCount = channel.countUnread()
  const [currentChannel, setCurrentChannel] = useState(null)
  const [colorBackground, setColorBackground] = useState(colors.dark.background)

  const {
    theme: {
      channelPreview: {checkAllIcon, checkIcon, date},
      colors: {grey},
    },
  } = useTheme()

  useEffect(() => {
    console.log(currentChannel, channel.id, "currentChannel, channel.id")
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



  const handleOnPress = () => {
       setChannel(channel)
       setCurrentChannel(channel?.id)
       //navigate(ROOT_STACK.CHANNEL_SCREEN)

        const channelMembers = channel.state.members;
        // Extract user IDs from the channel members object
        const userIds = Object.keys(channelMembers);
        navigate(ROOT_STACK.CONVOS, { channel:channel, channelId: channel.id, channelName: channel.data.name, channelUsers: userIds});
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
        size={38}
      />
      {/* <DMAvatar channel={channel}/> */}
      <View style={{flex: 1, marginHorizontal: sizes.l, justifyContent:'center'}}>
        <ChannelPreviewTitle channel={channel} displayName={displayName} />
        {/* <CustomChannelPreviewTitle displayName={displayName}/> */}
        {/* <View style={{flexDirection: 'row', marginTop: sizes.xs}}>
          <PeekabooView isEnabled={status === 2}>
            <CheckAll pathFill={grey} {...checkAllIcon} />
          </PeekabooView>
          <PeekabooView isEnabled={status === 1}>
            <Check pathFill={grey} {...checkIcon} />
          </PeekabooView>
          
          <PeekabooView isEnabled={isVoiceMessage}>
            <ChannelVoiceMessagePreview
              latestMessagePreview={latestMessagePreview}
            />
          </PeekabooView>
          <PeekabooView isEnabled={!isVoiceMessage}>
            <ChannelPreviewMessage
              latestMessagePreview={latestMessagePreview}
            />
          </PeekabooView>
        </View> */}
      </View>
      {/* <View style={{justifyContent: 'space-between'}}>
        <Text style={[styles.date, {color: grey}, date]}>
          {formatLatestMessageDate && latestMessageDate
            ? formatLatestMessageDate(latestMessageDate)
            : latestMessagePreview.created_at}
        </Text>
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
    </Pressable>
  )
}

const CustomChannelPreviewTitle = ({ displayName } : {
  displayName: string
}) => {

  return (
    <Text
      numberOfLines={1}
      style={{ color: colors.dark.text, fontSize: 14, fontWeight: 'bold' }}
    >
      {displayName}
    </Text>
  );
};

const CustomChannelPreviewUnreadCount = ({unread}) => {
  if (unread === 0) {
    return null;
  }

  const circleSize = 20;

  return (
    <View
      style={{
        backgroundColor: 'rgba(52, 183, 241, 0.5)',
        width: circleSize,
        height: circleSize,
        borderRadius: circleSize / 2,
        marginLeft: 6,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{color: '#0E1528', fontSize: 8, fontWeight: '600'}}>
        {unread > 99 ? '99+' : unread}
      </Text>
    </View>
  );
};

const ChannelVoiceMessagePreview = ({
  latestMessagePreview,
}: {
  latestMessagePreview: LatestMessagePreview
}) => {
  const firstAttchmentAudioLength = get(latestMessagePreview, [
    'messageObject',
    'attachments',
    0,
    'audio_length',
  ])

  const audioLengthInSeconds = useMemo(
    () => parseDurationTextToMs(firstAttchmentAudioLength),
    [firstAttchmentAudioLength],
  )

  if (audioLengthInSeconds === 0) return null

  const formattedAudioDuration = moment(audioLengthInSeconds).format('m:ss')

  return (
    <View style={styles.voiceMessagePreview}>
      <Mic
        pathFill={colors.dark.secondaryLight}
        width={sizes.ml}
        height={sizes.ml}
      />
      <Text style={styles.voiceMessagePreviewText}>
        {formattedAudioDuration}
      </Text>
    </View>
  )
}

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
