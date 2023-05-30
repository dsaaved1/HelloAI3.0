import {Alert, Platform, SafeAreaView, StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import {colors} from '../../theme'
import React, {useMemo, useState, useEffect} from 'react'
import {useAppContext} from '../../App'
import {flex, sizes} from '../../global'
import IconButton from '../IconButton'
import SuperAvatar from '../SuperAvatar'
import {useNavigation} from '@react-navigation/native'
import PeekabooView from '../PeekabooView'
import {get, isEmpty} from 'lodash'
import {MessageType, useMessagesContext} from 'stream-chat-react-native-core'
import {chatClient} from '../../client'
import {
  MessageStatusTypes,
  useChannelPreviewDisplayName,
  useMessageContext
} from 'stream-chat-react-native'
import {CHANNEL_STACK} from '../../stacks/ChannelStack'
import {StackNavigationProp} from '@react-navigation/stack'
import {StackNavigatorParamList} from '../../types'
import {createMessageExpanded} from '../../utils/actions/chatActions'
import { ROOT_STACK } from '../../stacks/RootStack'
import { SVGIcon } from '../SVGIcon';
import AntDesign from 'react-native-vector-icons/AntDesign';
//import { TouchableOpacity } from 'react-native-gesture-handler'

export default ({ oldChannel, solved }) => {
  const {navigate, goBack} =
    useNavigation<StackNavigationProp<StackNavigatorParamList>>()
  const {
    channel,
    selectedMessageIdsEditing,
    setSelectedMessageIdsEditing,
    messageInputRef,
    setChannel
  } = useAppContext()
  const displayName = useChannelPreviewDisplayName(channel, 30)
  const [mainChannel, setMainChannel] = useState(oldChannel || null);
  const {setQuotedMessageState, removeMessage, updateMessage} =
    useMessagesContext()

    const otherMember = channel?.state?.members
    ? Object.values(channel.state.members).find(
      member => member?.user?.id !== chatClient?.user?.id
    )
  : null;

  const oneUser = () => {
    return Object.keys(channel?.state?.members).length === 1
  }

  const chatName = oneUser() ? '' : channel?.data?.chatName 
  const mainChannelName =  !chatName ?  otherMember?.user?.name : chatName
 

  const [classMessageEnabled, setClassMessageEnabled] = useState(false);
  const [threadEnabled, setThreadEnabled] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  const colorTitle = solved ? '#8E8E' : '#D94444' 
  const icon = solved ? "checkcircle" : "closecircle"

  const handleBackButtonPress = () => {
    if (mainChannel) {
      setChannel(mainChannel);
    }
    goBack();
  };
  
  useEffect(() => {
    const updateClassMessageEnabled = async () => {
      if (selectedMessageIdsEditing.length !== 1) {
        setClassMessageEnabled(false);
        setThreadEnabled(false);
        return;
      }
      const messageId = get(selectedMessageIdsEditing, 0, 'id');
      const message = await chatClient.getMessage(messageId);

      if (message.message.isAI && !channel?.data?.isMessageConvo) {
        setThreadEnabled(true);
        setClassMessageEnabled(true);
        message.message.isSolved === 'unsolved' ? setIsSolved(true) : setIsSolved(false)
        
        
      }
    };
  
    updateClassMessageEnabled();
  }, [selectedMessageIdsEditing, isSolved]);
  
    
  const areAllMessagesPinned = useMemo(() => {
    const messages = channel?.state.messages.filter(({id}) =>
      selectedMessageIdsEditing.includes(id),
    )
    return messages?.every(({pinned}) => !!pinned)
  }, [channel?.id, JSON.stringify(selectedMessageIdsEditing)])

  const handleMenuOnPress = () => navigate(CHANNEL_STACK.CUSTOM_WALLPAPER, {channelId: channel?.id})
  const clearSelectedMessageIdsEditing = () => setSelectedMessageIdsEditing([])

  const handleReplyOnPress = () => {
    const message = channel?.state.messages.find(
      ({id}) => id === get(selectedMessageIdsEditing, 0, 'id'),
    ) as MessageType

    clearSelectedMessageIdsEditing()
    setQuotedMessageState(message)
    messageInputRef?.current?.focus()
  }

  const handleMessageExpanded = async () => {
    const messageId = get(selectedMessageIdsEditing, 0, 'id')
    const message = await chatClient.getMessage(messageId);
    const isMessageExpanded = message.message.isMessageExpanded
    console.log(isMessageExpanded, 'isMessageExpanded')

    if (!isMessageExpanded) {

      console.log("about to create message expanded")

      const channelMembers = channel?.state.members;
      // Extract user IDs from the channel members object
      const userIds = Object.keys(channelMembers);
      await createMessageExpanded(chatClient, messageId, userIds, message.message.text,
        message.message.question, message.message.model, message.message.modelAIPhoto, chatName)
      await chatClient.partialUpdateMessage(messageId, {
          set: {
             'isMessageExpanded': true
         }
      });

    }

    console.log("about to navigate to message expanded")


    const channelToWatch = chatClient.channel('messaging', messageId)
    clearSelectedMessageIdsEditing()
    

    setChannel(channelToWatch)
    //navigate(ROOT_STACK.THREAD_SCREEN)
   
    navigate(CHANNEL_STACK.THREAD_SCREEN, {
      channel: channelToWatch,
      channelId: messageId,
      solved: message.message.isSolved === 'solved' ? true : message.message.isSolved === 'unsolved' ? false : undefined,
      mainChannel: channel
    });
  }

  const handleIsSolved = async () => {
    const messageId = get(selectedMessageIdsEditing, 0, 'id')
    const message = await chatClient.getMessage(messageId); 
    //const channelToUpdate = chatClient.channel('messaging', messageId)
    const text = message.message.isSolved === 'unsolved' ? 'solved' : 'unsolved'

    if (text === 'solved') {
      setIsSolved(false)
    } else {
      setIsSolved(true)
    }

    clearSelectedMessageIdsEditing()
    await chatClient.partialUpdateMessage(messageId, {
       set: {
          'isSolved': text
      }
    });
    //messageInputRef?.current?.focus()
   
    //channelToUpdate && await channelToUpdate.updatePartial({ set:{ name: text } });
  }


  const handleToggleStarOnPress = async () => {
    const messages = channel?.state.messages.filter(({id}) =>
      selectedMessageIdsEditing.includes(id),
    ) as MessageType[]

    await Promise.all(
      messages?.map(message => {
        if (!areAllMessagesPinned && !message.pinned) {
          return chatClient.pinMessage(message, null)
        } else if (!!areAllMessagesPinned) {
          return chatClient.unpinMessage(message)
        }
      }),
    )

    clearSelectedMessageIdsEditing()
  }

  const handleDeleteMessageOnPress = async () => {
    const messages = channel?.state.messages.filter(({id}) =>
      selectedMessageIdsEditing.includes(id),
    ) as MessageType[]

    Alert.alert(
      'Delete Message',
      'Are you sure you want to permanently delete this message?',
      [
        {onPress: clearSelectedMessageIdsEditing, text: 'Cancel'},
        {
          onPress: async () => {
            await Promise.all(
              messages?.map(async message => {
                if (message.status === MessageStatusTypes.FAILED) {
                  removeMessage(message)
                } else {
                  const data = await chatClient.deleteMessage(message.id)
                  updateMessage(data.message)
                }
              }),
            )
            clearSelectedMessageIdsEditing()
          },
          style: 'destructive',
          text: 'Delete',
        },
      ],
      {cancelable: false},
    )
  }

  const isInMessageSelectionMode = !isEmpty(selectedMessageIdsEditing)

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.dark.secondary,
        ...flex.directionRowItemsCenter,
      }}>
      <PeekabooView isEnabled={isInMessageSelectionMode}>
        <View style={flex.directionRowItemsCenterContentSpaceBetween1}>
          <View style={flex.directionRowItemsCenter}>
            <IconButton
              onPress={clearSelectedMessageIdsEditing}
              iconName={'ArrowLeft'}
              pathFill={colors.dark.text}
            />
            <Text numberOfLines={1} style={styles.selectedMessagesCountText}>
              {selectedMessageIdsEditing.length}
            </Text>
          </View>

          <View style={flex.directionRowItemsCenter}>
             <IconButton
              isEnabled={threadEnabled}
              onPress={handleMessageExpanded}
              iconName={'Thread'}
              style={styles.buttonWrapper}
              pathFill={colors.dark.text}
              />
             <IconButton
              isEnabled={classMessageEnabled}
              onPress={handleIsSolved}
              iconName={isSolved ? 'Check' : 'Uncheck'}
              style={styles.buttonWrapper}
              pathFill={colors.dark.text}
            />
            <IconButton
              isEnabled={selectedMessageIdsEditing.length === 1}
              onPress={handleReplyOnPress}
              iconName={'ReplyArrow'}
              style={styles.buttonWrapper}
              pathFill={colors.dark.text}
            />
            <>
              <IconButton
                onPress={handleToggleStarOnPress}
                iconName={'Star'}
                style={styles.buttonWrapper}
                pathFill={colors.dark.text}
              />
              <PeekabooView isEnabled={areAllMessagesPinned}>
                <View style={styles.unpinnedIcon} />
              </PeekabooView>
            </>

            <IconButton
              onPress={handleDeleteMessageOnPress}
              iconName={'Trash'}
              style={styles.buttonWrapper}
              pathFill={colors.dark.text}
            />
          </View>
        </View>
      </PeekabooView>
      <PeekabooView isEnabled={!isInMessageSelectionMode}>
        <TouchableOpacity
        onPress={handleBackButtonPress}
        style={{padding: 10, marginLeft: 5}}>
           <SVGIcon height={18} type={'back-button'} width={18}/>
        </TouchableOpacity>
        {/* <IconButton
          onPress={goBack}
          iconName={'ArrowLeft'}
          pathFill={colors.dark.text}
        /> */}
        {/* <SuperAvatar isSelected={false} channel={channel} size={32} /> */}
        <View style={{padding: sizes.m, flex: 1, alignItems:'center'}}>
        <View style={{ flexDirection: 'row', justifyContent: 'center',}}>
          
          <Text
            numberOfLines={1}
            style={{
              color: colors.dark.text,
              fontWeight: 'bold',
              fontSize: sizes.lxl,
            }}>
            {displayName}
          </Text>
          {mainChannel && solved !== undefined && 
             <View style={{marginLeft: 8, paddingTop: 5}}>
             <AntDesign name={icon} size={15} color={colorTitle} />
             </View>
          }
           </View>
          {mainChannelName !== undefined && 
          <Text
            numberOfLines={1}
            style={{
              //color: colors.dark.transparentPrimary,
              color: colors.dark.secondaryLight,
              //fontWeight: 'bold',
              fontSize: sizes.ml,
            }}>   
            {mainChannelName}
          </Text>
          }
        </View>
        {/* <IconButton
          onPress={() => null}
          iconName={'Video'}
          pathFill={colors.dark.text}
        />
        <IconButton
          onPress={() => null}
          iconName={'Call'}
          pathFill={colors.dark.text}
        /> */}
        
          <IconButton
            onPress={Platform.OS === 'ios' ? handleMenuOnPress : null}
            iconName={'Menu'}
            pathFill={colors.dark.text}
          />
        
      </PeekabooView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  selectedMessagesCountText: {
    color: colors.dark.text,
    fontWeight: 'bold',
    fontSize: sizes.l,
  },
  unpinnedIcon: {
    position: 'relative',
    zIndex: 10,
    backgroundColor: colors.dark.secondary,
    top: 0,
    right: 32,
    width: 4,
    height: 36,
    transform: [{rotateX: '-45deg'}, {rotateZ: '-45deg'}],
  },
  buttonWrapper: {
    marginHorizontal: sizes.m,
  },
})
