import {Pressable, StyleSheet, Text, View,
Modal, TextInput, TouchableOpacity, Animated} from 'react-native'
import React, {useMemo, useState, useRef, useCallback} from 'react'
import {
  ChannelPreviewMessage,
  ChannelPreviewMessengerProps,
  ChannelPreviewTitle,
  ChannelAvatar,
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
import Trash from '../../icons/Trash'
import { TrashCan } from '../../icons/TrashCan'
import SuperAvatar from '../SuperAvatar'
import PeekabooView from '../PeekabooView'
import Mic from '../../icons/Mic'
import {get} from 'lodash'
import moment from 'moment'
import {parseDurationTextToMs} from '../../utils/conversion'
import {ROOT_STACK} from '../../stacks/RootStack'
import {StackNavigationProp} from '@react-navigation/stack'
import {StackNavigatorParamList} from '../../types'
import IconButton from '../IconButton'
import { Swipeable } from 'react-native-gesture-handler'
import { SVGIcon } from '../SVGIcon';


export default ({
  channel,
  latestMessagePreview,
  formatLatestMessageDate,
}) => {
  const navigation = useNavigation()
 //const {navigate} = useNavigation<StackNavigationProp<StackNavigatorParamList>>()
  const {setChannel} = useAppContext()
  const {selectedChannelsForEditing, setSelectedChannelsForEditing} =
    useAppContext()
  const [showModal, setShowModal] = useState(false);
  const [convoName, setConvoName] = useState('');   
   
  //for some reason here the direct messsages are not being displayed the other user name
  //that's why in invitation preview we hard coded the name
  const displayName = useChannelPreviewDisplayName(channel)
  const unreadCount = channel.countUnread()

  
  const {
    theme: {
      channelPreview: {checkAllIcon, checkIcon, date, title},
      colors: {grey, border, white_snow, accent_red},
    },
  } = useTheme()

  const isChannelMuted = channel.muteStatus().muted
  const isPinned = false
  const {status, messageObject} = latestMessagePreview
  const createdAt = latestMessagePreview.messageObject?.created_at
  const latestMessageDate = messageObject?.createdAt ? new Date(createdAt) : new Date()

  const [muted, setMuted] = useState(false);
  const renderRightActionss = useCallback(
    (_, dragX) => {
      const trans = dragX.interpolate({
        inputRange: [-100, 0],
        outputRange: [0.7, 0],
      });
  
      const trans2 = dragX.interpolate({
        inputRange: [-200, -100, 0],
        outputRange: [-99.3, -100, -0.7],
        extrapolate: 'clamp',
      });
  

      return (
        <>
          <TouchableOpacity
            //onPress={() => channel.delete()}
            style={[
              styles.actionContainer,
              {transform: [{translateX: trans}]},
            ]}>
            <View style={[styles.actionButton, {backgroundColor: accent_red}]}>
            <Muted pathFill={colors.dark.secondaryLight} width={16} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            //onPress={() => (muted ? unmute() : mute())}
            style={[
              styles.actionContainer,
              {transform: [{translateX: trans2}]},
            ]}>
            <View style={[styles.actionButton, {backgroundColor: '#4f4dc1'}]}>
              {muted ? (
                <Muted pathFill={colors.dark.secondaryLight} width={16} />
              ) : (
                <Muted pathFill={colors.dark.secondaryLight} width={16} />
              )}
            </View>
          </TouchableOpacity>
        </>
      );
    },
    [accent_red, channel, muted],
  );

  const rightSwipeActions = () => {
    return (
      <View style={{flexDirection:'row'}}>
        <View
        style={{
          backgroundColor: accent_red,
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
      >
        <TouchableOpacity
        style={{
          paddingHorizontal: 10,
          paddingHorizontal: 30,
          paddingVertical: 20,
        }}>
          <Trash pathFill={colors.dark.secondaryLight} width={25} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: '#4f4dc1',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
      >
        <TouchableOpacity
          onPress={() => {setShowModal(true), setConvoName(channel.data.name)}}
          style={{
            color: '#1b1a17',
            paddingHorizontal: 10,
            fontWeight: '600',
            paddingHorizontal: 30,
            paddingVertical: 20,
          }}
        >
            <SVGIcon height={25} type='edit-text' width={25} />
        </TouchableOpacity>
      </View>
      </View>
    );
}

  const toggleChannelSelectionForEditing = (selectedChannel) => {
    setSelectedChannelsForEditing(channels => {
      const existsInSelectedChannels = channels.includes(selectedChannel)
      return existsInSelectedChannels
        ? channels.filter(c => c !== selectedChannel)
        : [...channels, selectedChannel]
    })
  }

  const isSelectedForEditing = selectedChannelsForEditing.includes(channel)

  const isVoiceMessage =
    get(latestMessagePreview, ['messageObject', 'attachments', 0, 'type']) ===
    'voice-message'


  const handleOnPress = () => {
    setChannel(channel)
    navigation.navigate(ROOT_STACK.CHANNEL_SCREEN)
  }

  const handleRename = async () => {
    await channel.updatePartial({ set:{ name: convoName } });
    setShowModal(false);
    setConvoName('');
  };


  const handleOnLongPress = () => toggleChannelSelectionForEditing(channel)

  return (
    <Swipeable
      //renderRightActions={renderRightActions}
      renderRightActions={rightSwipeActions}
      overshootRight={false}
       >
    <View>
      <Pressable
        style={{
          ...styles.container,
          backgroundColor: isSelectedForEditing
            ? "#1C2340"
            : styles.container.backgroundColor,
        }}
        onPress={handleOnPress}
        onLongPress={handleOnLongPress}>
          <SuperAvatar
            channel={channel}
            isSelected={isSelectedForEditing}
            size={40}
            convo={true}
          />
        {/* <ChannelAvatar channel={channel} /> */}
        <View style={{flex: 1, marginHorizontal: sizes.l}}>
          <ChannelPreviewTitle channel={channel} displayName={displayName} />
          <View style={{flexDirection: 'row', marginTop: sizes.xs}}>
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
          </View>
        </View>
        <View style={{justifyContent: 'space-between'}}>
          <Text style={[styles.date, {color: grey}, date]}>
            {formatLatestMessageDate && latestMessageDate
              ? formatLatestMessageDate(latestMessageDate)
              : latestMessagePreview.created_at}
          </Text>
          <View style={flex.directionRowContentEnd}>
          
            <PeekabooView isEnabled={isChannelMuted}>
              <View style={{marginRight: 12}}>
                <Muted pathFill={colors.dark.secondaryLight} width={16} />
              </View>
            </PeekabooView>
            <PeekabooView isEnabled={isPinned}>
              <Pinned pathFill={colors.dark.secondaryLight} width={16} />
            </PeekabooView>
            <ChannelPreviewUnreadCount channel={channel} maxUnreadCount={50} unread={unreadCount}/>
          </View>
        </View>

        <Modal
           visible={showModal}
           animationType="slide"
           transparent={true}
       >
           <View style={styles.modalContainer}>
             <View style={styles.modalContent}>
               <Text style={styles.modalTitle}>Rename Convo</Text>

               <TextInput
                 style={styles.modalInput}
                 value={convoName}
                 onChangeText={(text) => setConvoName(text)}
                 placeholder="Enter convo name"
                 autoFocus={true}
                 onSubmitEditing={handleRename}
               />

               <View style={styles.modalButtonsContainer}>
                 <TouchableOpacity
                   style={styles.modalButton}
                   onPress={() => {setShowModal(false), setConvoName('')}}
                 >
                   <Text style={styles.modalButtonText}>Cancel</Text>
                 </TouchableOpacity>

               </View>
             </View>
           </View>
          </Modal>
      </Pressable>
      </View>
      </Swipeable>
  
  )
}

const ChannelVoiceMessagePreview = ({
  latestMessagePreview,
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
    backgroundColor: '#0E1528',
    margin: 0,
  },
  actionContainer: {
    flex: 1,
    maxWidth: 130
  },
  actionButton: {
    minWidth: 70,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#1C2333',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 30,
    width: `80%`,
    fontSize: 16,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#3777f0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
})