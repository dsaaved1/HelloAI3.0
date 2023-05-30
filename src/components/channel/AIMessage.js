import React, {PropsWithChildren,   useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, Text, StyleSheet, Image, Modal, TouchableOpacity } from 'react-native';
import {
    MessageisSolved,
    useMessageContext,
    useTheme,
    useChannelContext,
    MessageStatus
  } from 'stream-chat-react-native';
import {StreamChatGenerics} from '../../types'
import {
  MessageTouchableHandlerPayload,
} from 'stream-chat-react-native'
import {useAppContext} from '../../App'
import { MessageFooter } from '../MessageFooter';
import {Check} from 'stream-chat-react-native-core/src/icons/index'
import {colors} from '../../theme'
import {sizes} from '../../global'
import {SVGIcon} from '../SVGIcon'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import userImage from '../../images/userImage.jpeg'
import {isEmpty, get} from 'lodash'
import Clipboard from '@react-native-clipboard/clipboard';
import Octicons from 'react-native-vector-icons/Octicons'
import ThumbsContainer from '../ThumbsContainer';
import { chatClient } from '../../client';
import { measure } from 'react-native-reanimated';


  function format24Hours(dateString) {
    const date = new Date(dateString);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes;
  }

export default AIMessage = () => {
    const { message } = useMessageContext();
    const {setSelectedMessageIdsEditing, setActiveMessage} = useAppContext()
    const {channel} = useChannelContext()
    const reactionPickerRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);

    const openReactionPicker = (message) => {
      setActiveMessage(message);
      //actionSheetRef.current?.dismiss();
      reactionPickerRef.current?.present();
    };

    const isMessageDeleted = useMemo(
      () => !isEmpty(message.deleted_at),
      [message.id],
    )
  
    

    const handleToggleMessageSelection = ({
      message,
    }) => {

      const messageId = message?.id
  
      setSelectedMessageIdsEditing(ids => {
        const existsInSelectedChannels = ids.includes(messageId)
  
        return existsInSelectedChannels
          ? ids.filter(id => id !== messageId)
          : [...ids, messageId]
      })
    }

    useEffect(() => {
      setSelectedMessageIdsEditing([])
    }, [channel?.id, setSelectedMessageIdsEditing])
  
    useEffect(() => {
      return () => setSelectedMessageIdsEditing([])
    }, [])

    const oneUser = () => {
      return Object.keys(channel?.state?.members).length == 1
    }

    const copyToClipboard = async (text) => {
      try {
        Clipboard.setString(text);
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
        }, 1500); // Adjust the duration as needed
      } catch (error) {
        console.log(error);
      }
    };
  
    const isSolved = message.isSolved
    const classMessage = message.class
    const userName = classMessage === 'AIQuestion' ? message.user.name: message.model;
    const imageUser = message.user.image? { uri: message.user.image} :  userImage
    const source = classMessage === 'AIQuestion' ? imageUser : { uri: message.modelAIPhoto };
    const showThumbs =  classMessage === 'AIQuestion' 
    const date = message.created_at
    const dateString = date && format24Hours(date);
    const isStarred = message.pinned
  

    return (
      <View>
      <TouchableOpacity onPress={() => copyToClipboard(message.text)} onLongPress={() => handleToggleMessageSelection({ message })}>
        <View style={styles.wrapperStyle}>
          <View style={styles.container}>
            {!isMessageDeleted &&
              <View style={styles.profileContainer}>
                  <Image source={source} style={styles.profilePicture} />
              </View>
            }

              <View  style={styles.messageContainer}>

              
                  <View style={styles.nameContainer}>
                
                    
                       <Text style={styles.nameText}>{userName}</Text>
                      
                          {
                          dateString && !isMessageDeleted && 
                          <View style={styles.timeContainer}>
                                {isSolved && (
                                  <View style={{ marginBottom: 3}}>
                                        {isSolved === 'unsolved' ? (
                                           <View style={[styles.circleButton, { backgroundColor: '#D94444' }]}>
                                              <SVGIcon height={7} fill={'black'} type={'close-button'} width={7} />
                                           </View>
                                      
                                      ) : (
                                        <View style={styles.checkWrap}>
                                            <Check
                                               pathFill={colors.dark.background}
                                                width={14}
                                                height={14}
                                            />
                                        
                                        </View>
                                       
                                      )}
                                 </View>
                              )}

                              { isStarred && 
                              <FontAwesome name='star' size={14} color={'#8E8E93'} style={{ marginRight: 5 }} /> 
                              }
                              <Text style={styles.time}>{dateString}</Text>
                              {!oneUser() &&
                              <View style={{marginBottom: 3}}>
                                  <MessageStatus/>
                                  </View>
                              }
                          </View>             
                        }

                  </View>
                
                  <View style={styles.textContainer}>
                      <Text style={styles.text }>
                              {message.text}
                      </Text>
                  </View>

                  {!showThumbs &&
                      <ThumbsContainer message={message} oneUser={oneUser()} />
                  } 

              </View>
          </View>
        </View>
        {/* <MessageFooter
      // goToMessage={goToMessage}
      openReactionPicker={openReactionPicker}
    /> */}
        </TouchableOpacity>
       {/* Modal to display the copied message */}
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: 20, borderRadius: 10 }}>
              <Text style={{ color: '#fff', fontSize: 16 }}>Message Copied ✅</Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const styles = StyleSheet.create({
    wrapperStyle: {
        flexDirection: 'column',
        justifyContent: 'center',
        width: "100%",
        paddingHorizontal: 7,
    },
    container: {
        paddingVertical: 5,
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    profileContainer: {
        marginRight: 10,
      },
      profilePicture: {
        width: 28,
        height: 28,
        borderRadius: 9,
      },
      messageContainer: {
        flex: 1,
      },
      textContainer:{
        marginVertical: 5
      },
    text: {
        lineHeight: 22,
        fontSize: 15,
        //fontFamily: 'light',
        color: '#dcddde',
        marginBottom: 0,
    },
    timeContainer: {
        paddingRight:20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    time: {
        fontSize: 12,
        fontWeight: '400',
        color: '#8e9297',
        marginLeft: 5,
        marginRight: 5
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
    nameText: {
         //fontWeight: '600',
         fontWeight: 'bold',
        letterSpacing: 0.3,
        fontSize: 15,
        //fontFamily: 'medium',
        //color: '#D6D8E1',
        color: '#F4F5FA',
        marginRight: 8,
    },
    image: {
        width: '100%',
        maxHeight: 200,
        aspectRatio: 1,
        resizeMode: 'contain',
        marginRight: 30,
    }, 
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      checkWrap: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.dark.highlighted,
        backgroundColor: "#8E8E",
        marginRight: 12,
        width: 16,
        height: 16,
        marginBottom: 2
      },
      circleButton: {
        width: 16,
        height: 16,
        borderRadius: 25, // Half of the width and height to create a circle
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderColor: colors.dark.secondary,
        borderWidth: 1,
        marginBottom: 2
      },
  });
  