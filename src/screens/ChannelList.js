import { useState, useCallback, useEffect, useMemo } from 'react';
import {ChannelList} from 'stream-chat-react-native'
import ChannelPreview from '../components/channel-list/ChannelPreview'
import {useNavigation} from '@react-navigation/native'
import {ROOT_STACK} from '../stacks/RootStack'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import {chatClient} from '../client'
import CustomEmpty from '../components/CustomEmpty';

const twoMemberFilters = {
  members: { $in: [chatClient.user.id] },
  type: 'messaging',
  member_count: 2,
  isGroupChat: { $eq: false },
  typeChat: { $eq: 'chat'},
  temporary: { $exists: false }
};

const groupFilters = {
  members: { $in: [chatClient.user.id] },
  type: 'messaging',
  //member_count: { $gt: 2 },
  isGroupChat: { $eq: true },
  typeChat: { $eq: 'chat'}
};

const sort = { last_message_at: -1 };


export const List = props => {
  const showGroups = props.showGroups;
  const [refreshList, setRefreshList] = useState(false);
  //this might help me in my invitations bug
  const memoizedFilters = useMemo(() => {
    if (showGroups) {
      return groupFilters;
    } else {
      return twoMemberFilters;
    }
  }, [showGroups]);
  
  const navigation = useNavigation();
  
  // console.log("List rendered")

  // const handleChannelUpdate = useCallback((e) => {
  //   console.log("here")
  //   console.log('channel updated', e)
  //   console.log(e.channel.data.typeChat, 'typeChat')
  //   // Check if the updated channel has typeChat == 'chat'
  //   if (e.channel.data.typeChat === 'chat') {
  //     setRefreshList((prev) => !prev);
  //   }
  // }, []);
  
  // useEffect(() => {
  //   console.log("useEffect called invitations");
  
  //   const logChannelUpdatedEvent = (e) => {
  //     console.log("channel.updated event:", e);
  //   };
  
  //   chatClient.on("channel.updated", logChannelUpdatedEvent);
  
  //   chatClient.on("channel.updated", handleChannelUpdate);
  //   console.log("useEffect called on mount invitations");
  //   return () => {
  //     console.log("useEffect called on unmount invitations");
  //     chatClient.off("channel.updated", logChannelUpdatedEvent);
  //     chatClient.off("channel.updated", handleChannelUpdate);
  //   };
  // }, [handleChannelUpdate]);
  
  

  return (
    <View style={{ flex: 1}}>

      <View style={{ alignItems: "center", backgroundColor: '#0E1528' }}>
          <Pressable 
          onPress={() => navigation.navigate(ROOT_STACK.NEW_SCREEN, { isGroupChat: showGroups })}
          style={styles.buttonContainer}
          >
            <Text style={{color:'white'}}>+</Text>
          </Pressable>
      </View>

      <View style={{ flex: 1 }}>
        <ChannelList 
          //key={refreshList}
          Preview={ChannelPreview} 
          filters={memoizedFilters} 
          sort={sort}  
          EmptyStateIndicator={CustomEmpty}
        />
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
