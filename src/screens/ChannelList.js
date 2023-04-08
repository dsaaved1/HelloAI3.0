import React, {useMemo} from 'react'
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
  //typeChat: { $eq: 'chat'}
};


const groupFilters = {
  members: { $in: [chatClient.user.id] },
  type: 'messaging',
  member_count: { $gt: 2 },
  //typeChat: { $eq: 'chat'}
};


const sort = { last_message_at: -1 };


export const List = props => {
  const showGroups = props.showGroups;
  //this might help me in my invitations bug
  const memoizedFilters = useMemo(() => {
    if (showGroups) {
      return groupFilters;
    } else {
      return twoMemberFilters;
    }
  }, [showGroups]);
  
  const navigation = useNavigation();



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
        <ChannelList Preview={ChannelPreview} filters={memoizedFilters} sort={sort}  EmptyStateIndicator={CustomEmpty}/>
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
