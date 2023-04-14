import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import {colors} from '../theme'

const StarredMessages = props => {
    const channels =  props.route?.params?.channels || {};
    const [pinnedMessages, setPinnedMessages] = useState([]);

    const fetchPinnedMessages = async () => {
        const pinnedMessagesPromises = channels.map(async (channel) => {
            const channelState = await channel.query();
            //console.log(await channel.getPinnedMessages(), "other way")
            return channelState.pinned_messages;
        });

        const allPinnedMessages = await Promise.all(pinnedMessagesPromises);
        setPinnedMessages(allPinnedMessages.flat());
    };


    useEffect(() => {
        fetchPinnedMessages();
    }, []);

    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: () => (
                <View style={{ alignItems: 'center', margin: 5 }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                    Starred Messages
                </Text>
                </View>
            ),
            // headerLeft: () => {
                headerTintColor: '#3777f0', 
            // },
        })
    }, [pinnedMessages]);

    const renderItem = ({ item }) => {
        return (
        <View style={styles.messageContainer}>
            <Text style={styles.messageSender}>{item.user.name}:</Text>
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
        );
    };

    return (
        <View style={styles.container}>
        <FlatList
            data={pinnedMessages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
        />
        </View>
    );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    width: '100%',
  },
  messageContainer: {
    flexDirection: 'row',
    backgroundColor: colors.dark.secondary,
    padding: 16,
    borderBottomWidth: 0.2,
    borderBottomColor: colors.dark.secondaryLight,
  },
  messageSender: {
    fontWeight: 'bold',
    marginRight: 8,
    color: colors.dark.text
  },
  messageText: {
    flex: 1,
    color: colors.dark.text
  },
});


export default StarredMessages;
