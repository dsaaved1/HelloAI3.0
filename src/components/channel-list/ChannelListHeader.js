import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native'
import {colors} from '../../theme'
import React from 'react'
import {flex, sizes} from '../../global'
import IconButton from '../IconButton'
import PeekabooView from '../PeekabooView'
import {useAppContext} from '../../App'
import {isEmpty} from 'lodash'
import {chatClient} from '../../client'
import {createConvo} from '../../utils/actions/chatActions'
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default (props) => {
  const channelUsers = props.channelUsers
  const channel = props.channel

  console.log("channel  id", channel.cid)
  const navigation = useNavigation();



  const {selectedChannelsForEditing, setSelectedChannelsForEditing} =
    useAppContext()

  const isInChannelSelectionMode = !isEmpty(selectedChannelsForEditing)
  const clearSelectedChannelsForEditing = () =>
    setSelectedChannelsForEditing([])

  const handleMuteOnPress = () => {
    selectedChannelsForEditing.map(channel => channel?.mute())
    clearSelectedChannelsForEditing()
  }

  const handleCreateConvo = async () => {
    try {
        await createConvo(chatClient, channelUsers, channel.id, channel.data.name);
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
            <IconButton iconName={'Trash'} pathFill={colors.dark.text} />
            <IconButton iconName={'Pin'} pathFill={colors.dark.text} />
            <IconButton
              onPress={handleMuteOnPress}
              iconName={'Muted'}
              pathFill={colors.dark.text}
            />
          </View>
        </View>
      </PeekabooView>
      <PeekabooView isEnabled={!isInChannelSelectionMode}>
        <View style={styles.appNameText}>
          <Text style={styles.titleText}>{channel.data.name}</Text>
        </View>
        <IconButton
          onPress={handleCreateConvo}
          iconName={'CirclePlus'}
          //pathFill={'grey'}
        />
        {/* <IconButton
          onPress={() => null}
          iconName={'MagnifyingGlass'}
          pathFill={colors.dark.secondaryLight}
        /> */}
        <IconButton
          onPress={() => navigation.navigate('GroupInfo', { channel: channel})}
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
    fontSize: sizes.lxl,
  },
  appNameText: {padding: sizes.m, flex: 1},
})
