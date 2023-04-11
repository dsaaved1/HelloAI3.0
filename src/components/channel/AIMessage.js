import React, {PropsWithChildren,   useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {
    MessageisSolved,
    useMessageContext,
    useTheme,
    useChannelContext,
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

    const openReactionPicker = (message) => {
      setActiveMessage(message);
      //actionSheetRef.current?.dismiss();
      reactionPickerRef.current?.present();
    };
    

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
  
    const imageAttatched = message.image_url;
    const power = message.power
    const isSolved = message.isSolved
    const classMessage = message.class
    const userName = classMessage === 'AIQuestion' ? message.user.name: message.model;
    const userImage = classMessage === 'AIQuestion' ? message.user.image: message.modelAIPhoto;
    const date = message.created_at
    const dateString = date && format24Hours(date);
    const isStarred = message.pinned


    return (
      <TouchableOpacity onLongPress={() => handleToggleMessageSelection({ message })}>
        <View style={styles.wrapperStyle}>
          <View style={styles.container}>
              <View style={styles.profileContainer}>
                  <Image source={{ uri: userImage }} style={styles.profilePicture} />
              </View>

              <View  style={styles.messageContainer}>

                  <View style={styles.nameContainer}>
                
                      <Text style={styles.nameText}>{userName}</Text>
                          {
                          dateString && 
                          <View style={styles.timeContainer}>
                                {isSolved && (
                                  <>
                                        {isSolved === 'unsolved' ? (
                                           <View style={[styles.circleButton, { backgroundColor: '#D94444' }]}>
                                              <SVGIcon height={7} fill={'black'} type={'close-button'} width={7} />
                                           </View>
                                          // <View style={{ flexDirection: 'row', marginHorizontal:20}}>
                                              
                                          //     <Text style={{color:"#D86F6F", marginRight:10}}>Unsolved</Text>
                                          //     {/* <AntDesign name="checkcircleo" size={15} color="#D86F6F" /> */}
                                          // </View>
                                      ) : (
                                        <View style={styles.checkWrap}>
                                            <Check
                                                pathFill={colors.dark.background}
                                                width={sizes.l}
                                                height={sizes.l}
                                            />
                                        
                                        </View>
                                          // <View style={{ flexDirection: 'row', marginHorizontal:20}}>
                                              
                                          //     <Text style={{color:"#8E8E", marginRight: 10}}>Solved</Text>
                                          //     {/* <AntDesign name="checkcircle" size={15}  color={'#8E8E'} /> */}
                                              
                                          // </View>
                                      )}
                                  </>
                              )}

                              { isStarred && 
                              <FontAwesome name='star' size={14} color={'#8E8E93'} style={{ marginRight: 5 }} /> 
                              }
                              <Text style={styles.time}>{dateString}</Text>
                          </View>             
                        }

                  </View>

                  <View style={styles.textContainer}>
                      <Text style={styles.text }>
                              {message.text}
                      </Text>
                  </View>

              </View>
          </View>
        </View>
        {/* <MessageFooter
      // goToMessage={goToMessage}
      openReactionPicker={openReactionPicker}
    /> */}
      </TouchableOpacity>
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
        marginRight: 15,
      },
      profilePicture: {
        width: 30,
        height: 30,
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
        fontSize: 16,
        //fontFamily: 'light',
        color: '#dcddde',
        marginBottom: 4,
    },
    menuItemContainer: {
        flexDirection: 'row',
        padding: 5,
    },
    menuText: {
        flex: 1,
        //fontFamily: 'regular',
        letterSpacing: 0.3,
        fontSize: 14,
        color: "#fff",
    },
    timeContainer: {
        paddingRight:20,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    time: {
        fontSize: 12,
        fontWeight: '400',
        color: '#8e9297',
        marginLeft: 5,
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
    nameText: {
         fontWeight: '600',
        letterSpacing: 0.3,
        fontSize: 16,
        //fontFamily: 'medium',
        color: '#ffffff',
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
        padding: 2,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: colors.dark.highlighted,
        backgroundColor: colors.dark.primaryLight,
        marginRight: 9,
      },
      circleButton: {
        width: 23,
        height: 23,
        borderRadius: 25, // Half of the width and height to create a circle
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
        marginRight: 9,
        borderColor: colors.dark.secondary,
        borderWidth: 1,
      },
  });
  