import { useState, useCallback, useEffect, useMemo, useRef} from 'react';
import {ChannelList} from 'stream-chat-react-native'
import ChannelPreview from '../components/channel-list/ChannelPreview'
import {useNavigation} from '@react-navigation/native'
import {ROOT_STACK} from '../stacks/RootStack'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Pressable, ScrollView, FlatList} from 'react-native';
import {chatClient} from '../client'
import CustomEmpty from '../components/CustomEmpty';
import { useFocusEffect } from '@react-navigation/native';
import ConvoPreview from '../components/channel-list/ConvoPreview';



export const List = props => {
  const twoMemberFilters = {
    members: { $in: [chatClient?.user?.id] },
    type: 'messaging',
    member_count: 2,
    isGroupChat: { $eq: false },
    typeChat: { $eq: 'chat'},
    $or: [
      {
        invite: 'accepted',
      },
      {
        created_by_id: chatClient?.user?.id,
      },
    ],
  };
  
  const groupFilters = {
    members: { $in: [chatClient?.user?.id] },
    type: 'messaging',
    member_count: { $gt: 1 },
    isGroupChat: { $eq: true },
    typeChat: { $eq: 'chat'},
    $or: [
      {
        invite: 'accepted',
      },
      {
        created_by_id: chatClient?.user?.id,
      },
    ],
  };
  
  const sort = { last_message_at: -1 };

  const showGroups = props.showGroups;
  const memoizedFilters = useMemo(() => {
    if (showGroups) {
      return groupFilters;
    } else {
      return twoMemberFilters;
    }
  }, [showGroups]);
  
  const navigation = useNavigation();
  
  const [channels, setChannels] = useState([]);

  const fetchChannels = async () => {
    try {
      const channels = await chatClient.queryChannels(memoizedFilters, sort, {
        watch: true,
        state: true,

      });
      setChannels(channels);
      channels.forEach(channel => {
        channel.on('channel.deleted', () => fetchChannels());
        channel.on('channel.created', () => fetchChannels());
        channel.on('channel.unmuted', () => fetchChannels());
        channel.on('channel.muted', () => fetchChannels());
        channel.on('connection.changed', () => fetchChannels());
        channel.on('connection.recovered', () => fetchChannels());
        channel.on('user.presence.changed', () => fetchChannels());
        channel.on('user.watching.start', () => fetchChannels());
        channel.on('user.watching.stop', () => fetchChannels());
      });
    } catch (error) {
      console.log(error);
    }
  };


  const channelsRef = useRef(channels);
  useEffect(() => {
    channelsRef.current = channels;
  }, [channels]);


  useFocusEffect(
    useCallback(() => {
      console.log("here in use effect of channel list");
      fetchChannels();

      // Clean up event listeners on unmount
      return () => {
        channelsRef.current.forEach(channel => {
          channel.off('channel.deleted');
          channel.off('channel.created');
          channel.off('channel.unmuted');
          channel.off('channel.muted');
          channel.off('connection.changed');
          channel.off('connection.recovered');
          channel.off('user.presence.changed');
          channel.off('user.watching.start');
          channel.off('user.watching.stop');
        });
      };
    }, [memoizedFilters, navigation])
  );

  return (
    <View style={{ flex: 1}}>

      <View style={{ alignItems: "center", backgroundColor: '#0E1528' }}>
          <Pressable 
          onPress={() => navigation.navigate(ROOT_STACK.NEW_SCREEN, { isGroupChat: showGroups, isNewChat: true})}
          style={styles.buttonContainer}
          >
            <Text style={{color:'white'}}>+</Text>
          </Pressable>
      </View>

      <View style={{ flex: 1 }}>
         <FlatList
          data={channels}
          keyExtractor={(item) => item.cid}
          renderItem={({ item }) => (
            <ChannelPreview
              channel={item}
            />
          )}
          />
        {/* <ChannelList 
          //key={refreshList}
          Preview={ChannelPreview} 
          filters={memoizedFilters} 
          sort={sort}  
          EmptyStateIndicator={CustomEmpty}
        /> */}
      </View>

  </View>
  );
};


const styles = StyleSheet.create({
    buttonContainer: {
      backgroundColor: "#3777f0",
      marginHorizontal: 10,
      marginBottom: 10,
      marginTop: 5,
      alignItems: "center",
      borderRadius: 5,
      width: '85%',
      padding:7
    },
});
