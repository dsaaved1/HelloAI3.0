import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native'
import {colors} from '../../theme'
import React, { useState, useEffect } from 'react';
import {flex, sizes} from '../../global'
import IconButton from '../IconButton'
import PeekabooView from '../PeekabooView'
import {useAppContext} from '../../App'
import {isEmpty} from 'lodash'
import {chatClient} from '../../client'
import {createConvo} from '../../utils/actions/chatActions'
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ROOT_STACK} from '../../stacks/RootStack'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


export default (props) => {
  const channel = props.channel
  const navigation = useNavigation();
  const channelMembers = channel.state.members;
  // Extract user IDs from the channel members object
  const channelUsers = Object.keys(channelMembers);
  const [showRefreshIcon, setShowRefreshIcon] = useState(false);

  const otherMember = channel?.state?.members
    ? Object.values(channel.state.members).find(
      member => member.user.id !== chatClient?.user?.id
    )
  : null;

  const {selectedChannelsForEditing, setSelectedChannelsForEditing} =
    useAppContext()
  const {setChannel} = useAppContext()
  const isInChannelSelectionMode = !isEmpty(selectedChannelsForEditing)
  const clearSelectedChannelsForEditing = () => setSelectedChannelsForEditing([])
  const nameChannel = (channel.data.isGroupChat === undefined || channel.data.isGroupChat === true) ? channel.data.name : otherMember?.user?.name;



  const handleRefreshIconPress = () => {
    setShowRefreshIcon(true);
    setTimeout(() => {
      setShowRefreshIcon(false);
    }, 2500); // Set the time (in milliseconds) for how long the icon should be visible
  };

  
  const handleMuteOnPress = async () => {
    selectedChannelsForEditing.map(async channel => {
      console.log(channel.muteStatus().muted, "jey")
      if (channel.muteStatus().muted) {
        await channel.unmute();
      } else {
        await channel.mute();
      }
    });
    clearSelectedChannelsForEditing()
    handleRefreshIconPress();
  }

  const handleDeleteOnPress = async () => {
    const channelCids = selectedChannelsForEditing.map(channel => channel.cid);
    // client-side soft delete
    await chatClient.deleteChannels(channelCids);
    clearSelectedChannelsForEditing()
  }

  const handleCreateConvo = async () => {
    try {
      await createConvo(chatClient, channelUsers, channel.id, nameChannel);
      handleRefreshIconPress();
        // const newChannel = await createConvo(chatClient, channelUsers, channel.id, nameChannel);
        // if (newChannel) {
        //   setChannel(newChannel);
        //   navigation.navigate(ROOT_STACK.CHANNEL_SCREEN);
        // }
    } catch (error) {
      console.error('Error creating convo:', error);
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.dark.secondary,
        //backgroundColor: '#1C2332',
        ...flex.directionRowItemsCenter,
      }}>
      <StatusBar backgroundColor={colors.dark.secondary} />
      
      <PeekabooView isEnabled={isInChannelSelectionMode}>
        <View style={flex.directionRowItemsCenterContentSpaceBetween1}>
          <View style={flex.directionRowItemsCenter}>
            <IconButton
              onPress={clearSelectedChannelsForEditing}
              iconName={'ArrowLeft'}
              pathFill={colors.dark.text}
            />
            <Text numberOfLines={1} style={styles.numberOfSelectedChannels}>
              {selectedChannelsForEditing.length}
            </Text>
          </View>

          <View style={flex.directionRowItemsCenter}>
            <IconButton 
              onPress={handleDeleteOnPress} 
              iconName={'Trash'} 
              pathFill={colors.dark.text} />
            {/* <IconButton iconName={'Pin'} pathFill={colors.dark.text} /> */}
            {channel.data.isGroupChat === undefined &&

              <IconButton
              onPress={handleMuteOnPress}
              iconName={'Muted'}
              pathFill={colors.dark.text}
              />
            }
            <IconButton
              onPress={handleMuteOnPress}
              iconName={'Muted'}
              pathFill={colors.dark.text}
            />
          </View>
        </View>
      </PeekabooView>
      <PeekabooView isEnabled={!isInChannelSelectionMode}>
     {/* {Platform.OS === 'android' ? ( */}
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{marginLeft:7}}
          >
            <Ionicons name="md-menu" size={30} color={colors.dark.secondaryLight} />
          </TouchableOpacity>
       {/*  ) : null} */}
        <View style={styles.appNameText}>
          <Text style={styles.titleText}>
            {nameChannel}
            </Text>
        </View>
        {showRefreshIcon && (
          <View style={styles.refreshWrapper}>
            <MaterialIcons name="refresh" size={30} color={colors.dark.secondaryLight} />
            <Text style={styles.refreshText}>Refresh List</Text>
          </View>
        )}
        <IconButton
          onPress={handleCreateConvo}
          iconName={'CirclePlus'}
          //pathFill={'grey'}
        />
        {/* <IconButton
          onPress={() => null}
          iconName={'MagnifyingGlass'}
          pathFill={colors.dark.secondaryLight}
          () => navigation.navigate(ROOT_STACK.CONVOS)
        /> */}
        <IconButton
          onPress={() => navigation.navigate('Info', { channel: channel})}
          iconName={'Menu'}
          pathFill={colors.dark.secondaryLight}
        />
      </PeekabooView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  numberOfSelectedChannels: {
    color: colors.dark.text,
    fontWeight: 'bold',
    fontSize: sizes.l,
  },
  titleText: {
    color: colors.dark.secondaryLight,
    fontWeight: 'bold',
    fontSize: sizes.xl,
  },
  appNameText: {padding: sizes.m, flex: 1},
  refreshText: {
    color: colors.dark.secondaryLight,
    position: 'absolute',
    right: -4,
    top: -9,
    fontSize: 10
  },
  refreshWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginRight: 10
  },
})
