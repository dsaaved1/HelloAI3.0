import { useState, useCallback, useEffect, useMemo } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Pressable, SafeAreaView, TextInput} from 'react-native';
import {ChannelList} from 'stream-chat-react-native';
import {chatClient} from '../client'
import ConvoPreview from '../components/channel-list/ConvoPreview';
import ChannelListHeader from '../components/channel-list/ChannelListHeader';
import CustomEmpty from '../components/CustomEmpty';
import {colors} from '../theme'
import { ScreenHeader } from '../components/ScreenHeader';
import { useNavigation } from '@react-navigation/native';



const Convos = ({route}) => {
  const {channelId} = route?.params || {};
  const {channelName} = route?.params || {};
  const {channelUsers} = route.params || {};
  const {channel} = route.params || {};
  const navigation = useNavigation();
 

  // const [refreshList, setRefreshList] = useState(false);

  // console.log("convos rendered")

  // const handleChannelUpdate = useCallback((e) => {
  //   console.log('channel updated', e)
  //   console.log(e.channel.data.typeChat, 'typeChat')
  //   // Check if the updated channel has typeChat == 'chat'
  //   if (e.channel.data.typeChat === 'convo') {
  //     setRefreshList((prev) => !prev);
  //   }
  // }, []);
  
  // useEffect(() => {
  //   console.log("here")
  //   console.log("useEffect called convos")
  //   chatClient.on('channel.updated', handleChannelUpdate);
  //   console.log("useEffect called on mount convos")
  //   return () => {
  //     console.log("useEffect called on unmount convos")
  //     chatClient.off('channel.updated', handleChannelUpdate);
  //   };
  // }, [handleChannelUpdate]);


  //have an input box and a default channel that's where all questions
  //from input box go, and that's the first channel everyone has 
  //after signing up
  if (!channelId) {
    console.error('Channel ID is undefined.');
    // You can return an error message or handle the error differently here.
    return (
      <View style={{
        backgroundColor: colors.background,
        flex: 1,
      }}>
        
          <ScreenHeader title='Home' />
          <SafeAreaView style={styles.container}>
          {/* <View style={styles.header}>
            <Text style={styles.title}>Hello AI</Text>
          </View> */}
          {/* <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search here..."
              placeholderTextColor="#999"
            />
          </View> */}
          
        </SafeAreaView>
      </View>
    );
  }

  // Define custom filters based on the channelId
  const filters = { 
    type: 'messaging', 
    members: { $in: [chatClient?.user?.id] }, 
    chatId: channelId, 
    typeChat: { $eq: 'convo'}
  };
  const sort = { last_message_at: -1 };
 
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.dark.secondary}}>
       <ChannelListHeader channel={channel} channelName={channelName} channelId={channelId} channelUsers={channelUsers}/>
       

        <ChannelList
            //key={refreshList}
            Preview={ConvoPreview}
            filters={filters}
            sort={sort}
            EmptyStateIndicator={CustomEmpty}
        />
    </SafeAreaView>
  );
};

export default Convos;

const styles = StyleSheet.create({
  bottomContainer: {
    width: '100%',
    position: "absolute",
    bottom: 0,
    backgroundColor: colors.dark.secondary,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 10,
  },
  button: {
    borderRadius: 20,
    paddingRight: 20,
    paddingVertical: 5,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    backgroundColor: '#3777f0',
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 100
  },
  title: {
    color: '#fff',
    fontSize: 34,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: '#3777f0',
    //backgroundColor: '#6200EE',
    alignItems: 'center',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 14,
    color: '#000',
    width: '90%',
  },
})