import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Pressable, FlatList, ScrollView } from 'react-native';
import {colors} from '../theme'
import {Avatar} from 'stream-chat-react-native'
import { chatClient } from '../client';
import Ionicons from "react-native-vector-icons/Ionicons"

const ThumbsContainer = (props ) => {
  const {
    message,
    oneUser
  } = props;
  // const [thumbsUpCount, setThumbsUpCount] = useState(Object.keys(message?.thumbsUp || {}).length);
  // const [thumbsDownCount, setThumbsDownCount] = useState(Object.keys(message?.thumbsDown || {}).length);
  const [modalVisible, setModalVisible] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const userId = chatClient?.user?.id
  const userName = chatClient?.user?.name
  const userImage = chatClient?.user?.image
  // const message = props.route?.params?.message
  // const messageId = props.route?.params?.messageId
  const messageThumbsUp = message?.thumbsUp || {};
  const messageThumbsDown = message?.thumbsDown || {};
  //  message?.thumbsUp and  message?.thumbsDown has format of: {userId1: {image: userImage, name: userName}, userId2: {userImage, name: userName}, ...}
  const thumbsUpUsers = Object.values(messageThumbsUp);
  const thumbsDownUsers = Object.values(messageThumbsDown);


  const handleThumbsUp = async () => {
    if (userId in messageThumbsUp) {
      console.log("about to delete user id from message thumbs up")
      // Remove user ID from 'object'
      const updatedObject = { ...messageThumbsUp };
      delete updatedObject[userId];

      await chatClient.partialUpdateMessage(message?.id, {
        set: {
          thumbsUp: updatedObject
        }
      });

      setThumbsUpCount(prevCount => prevCount - 1);
    } else {
      // Add user ID to 'object'
      console.log("about to add user id into message thumbs up")
      const updatedObject = { ...messageThumbsUp, [userId]: { image: userImage, name: userName } };

      await chatClient.partialUpdateMessage(message?.id, {
        set: {
          thumbsUp: updatedObject
        }
      });

      setThumbsUpCount(prevCount => prevCount + 1);
    }
  };

  const handleThumbsDown = async () => {
    if (userId in messageThumbsDown) {
      console.log("about to delete user id from message thumbs down")
      // Remove user ID from 'object'
      const updatedObject = { ...messageThumbsDown };
      delete updatedObject[userId];

      await chatClient.partialUpdateMessage(message?.id, {
        set: {
          thumbsDown: updatedObject
        }
      });

      setThumbsUpCount(prevCount => prevCount - 1);
    } else {
      console.log("about to add user id into message thumbs down")
      // Add user ID to 'object'
      const updatedObject = { ...messageThumbsDown, [userId]: { image: userImage, name: userName } };

      await chatClient.partialUpdateMessage(message?.id, {
        set: {
          thumbsDown: updatedObject
        }
      });

      setThumbsUpCount(prevCount => prevCount + 1);
    }
  };

  const handleViewUsers = () => {
    setModalVisible(true);
  };

  const handleCarouselChange = (index) => {
    setCarouselIndex(index);
  };

  
  

  const renderItem = ({item}) => (
    <View style={styles.userContainer}>
      <Avatar 
      //if its not convo render the initial letters image
      image={item.image} 
      name={item.name} size={30} />
       <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
     </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleThumbsUp} style={styles.iconContainer}>
        <Text style={styles.icon}>👍</Text>
        <Text style={styles.count}>{Object.keys(message?.thumbsUp || {}).length}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleThumbsDown} style={[
    styles.iconContainer,
    { marginRight: oneUser ? 40 : 0 }
  ]}>
        <Text style={styles.icon}>👎</Text>
        <Text style={styles.count}>{Object.keys(message?.thumbsDown || {}).length}</Text>
      </TouchableOpacity>
      {!oneUser &&
        <TouchableOpacity onPress={handleViewUsers} style={styles.button}>
          <Text style={styles.buttonText}>View Users</Text>
        </TouchableOpacity>
      }
      <Modal
           visible={modalVisible} 
           //animationType="slide"
           transparent={true}
       >
        
           <View style={styles.modalContainer}>
          
           
              
            <View style={styles.modalContent}>
            <TouchableOpacity
            style={styles.closeIconContainer}
            onPress={() => setModalVisible(false)}
          >
                <Ionicons name="close" size={20} color={colors.dark.secondaryLight} />
          </TouchableOpacity>

              <View style={styles.carouselContentContainer}>
                    <TouchableOpacity
                      style={[
                        styles.carouselItem,
                        carouselIndex === 0 && styles.activeCarouselItem,
                      ]}
                      onPress={() => handleCarouselChange(0)}
                    >
                      <Text style={styles.carouselItemText}>Thumbs Up</Text>
                    </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.carouselItem,
                          carouselIndex === 1 && styles.activeCarouselItem,
                        ]}
                        onPress={() => handleCarouselChange(1)}
                      >
                        <Text style={styles.carouselItemText}>Thumbs Down</Text>
                      </TouchableOpacity>
                </View>
                  
                    {carouselIndex === 0 ? (
                
                       
                        <FlatList
                            data={thumbsUpUsers}
                            //keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                        />
        
                    ) : (
                     
                    <FlatList
                        data={thumbsDownUsers}
                        //keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                    />
                   
                    )}
                  
              </View>
           
           </View>
    
          </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
    fontSize: 16,
  },
  count: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  button: {
    backgroundColor: '#337ab7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  modalContent: {
    backgroundColor: '#1C2333',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    elevation: 20,
    width: '80%',
    height: 300,
  },
  carouselContentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  carouselItem: {
    marginRight: 16,
    marginBottom: 15
  },
  scrollViewContainer: {
    flex: 1,
  },
  activeCarouselItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.text,
    marginBottom: 15
  },
  carouselItemText: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: 'bold',
    
  },
  userContainer: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#555',
    flexDirection: 'row',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
  userName: {
    color: 'white',
    fontSize: 16,
  },
  closeIconContainer: {
    position: 'absolute',
    top: 7,
    right: 7,
    
  },
});

export default ThumbsContainer;