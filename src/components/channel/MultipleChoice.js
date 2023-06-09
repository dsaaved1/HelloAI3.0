import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
  } from 'react';
  import { View, Text, StyleSheet, Image, Modal, TouchableOpacity, FlatList, Animated } from 'react-native';
  import {
      useMessageContext,
      useTheme,
      useChannelContext,
      MessageStatus
    } from 'stream-chat-react-native';
  import {useAppContext} from '../../App'
  import {colors} from '../../theme'
  import FontAwesome from 'react-native-vector-icons/FontAwesome';
  import Ionicons from "react-native-vector-icons/Ionicons"
  import userImage from '../../images/userImage.jpeg'
  import {isEmpty, get} from 'lodash'
  import ThumbsContainer from '../ThumbsContainer';
  import { chatClient, user } from '../../client';
  import Paginator from './Paginator';
  import { Dimensions } from 'react-native';
  import chatAI from '../../images/chatAI.png'
  import hiBot from '../../images/hiBot.jpeg'
  import {Avatar} from 'stream-chat-react-native'

  
  
    function format24Hours(dateString) {
      const date = new Date(dateString);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      return hours + ':' + minutes;
    }
  
  export default MultipleChoice = () => {
      const { message } = useMessageContext();
      const {setSelectedMessageIdsEditing} = useAppContext()
      const {channel} = useChannelContext()
    //   const [currentIndex, setCurrentIndex] = useState(0);
    //   const scrollX = useRef(new Animated.Value(0)).current;
    //   const slidesRef = useRef(null)

    //   const screenWidth = Dimensions.get('window').width - 50;
    // State variable to control whether the explanation or options are shown
    const [showExplanation, setShowExplanation] = useState(false);
    const [modalOptionUsers, setModalOptionUsers] = useState(false);
    const [optionUsers, setOptionUsers] = useState(false);
    
    // Button click handler to toggle showExplanation
    const handleButtonClick = () => {
      setShowExplanation(!showExplanation);
    }

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
  
      const makeOptionsIndex = () => {
        let optionsIndex = {}
        for (let i = 0; i < message.options.length; i++) {
          optionsIndex[i] = { count: 0, users: ["someone"] };
        }
        return optionsIndex;
      }

      const chooseOption = async (index) => {

          const userId = chatClient?.user?.id
          // optionsIndex: {0:{0, []}, 1:{0, []}, 2:{0, []}, 3:{0, []}}

          const optionsIndex = message.optionsIndex || makeOptionsIndex()
          const totalOptionsNum = message.totalOptionsNum || 0;
        
          // Increment the count for the chosen index and add user to the users array
          optionsIndex[index].count++;
          optionsIndex[index].users.push(userId);

          // Increase the total options number
          const newTotalOptionsNum = totalOptionsNum + 1;

          const oldQuizAnsweredUsers = message.quizAnsweredUsers
          const updatedObject = [ ...oldQuizAnsweredUsers, userId];
          console.log(updatedObject, "updatedObject")
        
          await chatClient.partialUpdateMessage(message?.id, {
            set: {
              quizAnsweredUsers: updatedObject,
              optionsIndex: optionsIndex,
              totalOptionsNum: newTotalOptionsNum
            }
          });
          
          setIsQuiz(false);
      };
      

      const options = message.options
      const answer = message.answer
      const question = message.question
      const explanation = message.explanation 
      const userName = message.model;
      const imageUser = message.user.image? { uri: message.user.image} :  userImage
      const source = imageUser
      const date = message.created_at
      const dateString = date && format24Hours(date);
      const isStarred = message.pinned
      //const isQuiz = message.isQuiz
      const [isQuiz, setIsQuiz] = useState(message.isQuiz);
      const quizAnswered = message.quizAnsweredUsers && message.quizAnsweredUsers.includes(chatClient?.user?.id);


      let Container = (isQuiz && !quizAnswered) ? TouchableOpacity : View;
    
      // Add this piece of code inside your MultipleChoice component but outside of the return statement:
    const optionsElements = options.map((option, index) => {
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        const isCorrectOption = (index === answer);
        const optionBorder = (!quizAnswered && isQuiz ) ? 'white' : isCorrectOption ? "#8E8E" :  colors.dark.secondaryLight;
        const optionText = (!quizAnswered && isQuiz ) ? 'white' : isCorrectOption ? 'white' : colors.dark.secondaryLight; // Choose your preferred gray color

         // Calculate the percentage for this option
        const optionsIndex = message.optionsIndex || makeOptionsIndex()
        const totalOptionsNum = message.totalOptionsNum || 0;
        const optionPercentage = totalOptionsNum > 0 ? Math.round((optionsIndex[index].count / totalOptionsNum) * 100) : 0;

        const optionUsersNotEmpty = optionsIndex && optionsIndex[index] && optionsIndex[index].users && optionsIndex[index].users !== null && optionsIndex[index].users.length > 1;


        return (
          <View style={{ flexDirection: 'row', alignItems: 'center' }} key={index}>
          <View style={[styles.optionBox, {borderColor: optionBorder, flex: 1}]}>
            <Container onPress={() => chooseOption(index)} style={styles.optionTextContainer}>
                <Text style={[styles.optionLetter, { color: optionText }]}>{`${letters[index]}   `}</Text>
                <Text style={[styles.optionText, { color: optionText }]}>{` ${option}`}</Text>
                {quizAnswered &&
                  <>
                    <Text style={{fontSize:12, color: optionBorder, marginLeft: 10}}>{`${optionPercentage} %`}</Text>
                  </>
                }
            </Container>
          </View>
          {optionUsersNotEmpty && quizAnswered &&
            <TouchableOpacity 
              onPress={() => {
                setOptionUsers(optionsIndex[index].users);
                setModalOptionUsers(true);
              }}
            >
             
                <Avatar 
                // //if its not convo render the initial letters image
                // image={item.image} 
                name={optionsIndex[index].users[1]} size={20} />
                
             
            </TouchableOpacity>
          }
      </View>
        );
    });

    const explanationRender = () => {
        return (
            <View style={{alignItems:'center'}}>
                <Text style={{color: 'white', fontWeight: 'bold', marginBottom: 7, marginTop: 9}}>Explanation</Text>
                <Text style={{color: colors.dark.secondaryLight}}>{explanation}</Text>
            </View>
        )

    }

    const renderItem = ({item}) => (
      item !== "someone" &&
      <View style={styles.userContainer}>
        <Avatar 
        // //if its not convo render the initial letters image
        // image={item.image} 
        name={item} size={30} />
         <View style={styles.userInfo}>
          <Text style={styles.userName}>{item}</Text>
       </View>
      </View>
    
    );

    // const slides = [
    //     {type: 'options'}, 
    //     {type: 'explanation'}
    //   ];
    
    //   const renderItem = ({item}) => {
    //     const opacity = scrollX.interpolate({
    //         inputRange: [
    //             (currentIndex - 1) * screenWidth,
    //             currentIndex * screenWidth,
    //             (currentIndex + 1) * screenWidth
    //         ],
    //         outputRange: [0.3, 1, 0.3],
    //         extrapolate: 'clamp',
    //     });
        
    //     if (item.type === 'options') {
          
    //        // console.log("here in options ")
    //        return (
    //         <View style={{width: screenWidth, flex: 1, opacity}}>
    //             {options.map((option, index) => {
    //                 const letters = ['A', 'B', 'C', 'D']; 
    //                 const isCorrectOption = (index === answer);
    //                 const optionBorder = isCorrectOption ? styles.optionCorrect : styles.optionIncorrect;
    //                 const optionColor = isCorrectOption ? 'white' : colors.dark.secondaryLight;

    //                 return (
    //                     <View style={optionStyle} key={index}>
    //                         <View style={styles.optionTextContainer}>
    //                             <Text style={[styles.optionLetter, { color: optionColor }]}>{`${letters[index]}   `}</Text>
    //                             <Text style={[styles.optionText, { color: optionColor }]}>{` ${option}`}</Text>
    //                         </View>
    //                     </View>
    //                 );
    //             })}
    //         </View>
    //     );
           
    //     } else if (item.type === 'explanation') {
    //         //console.log("here in explanation ")
    //       return (
    //         <View style={{width: screenWidth, flex: 1, opacity}}>
    //             <Text>Explanation</Text>
    //             <Text>{explanation}</Text>
    //         </View>
    //       );
    //     } else {
    //       return null;
    //     }
    //   }

  
      return (
        <View style={{flex: 1,}}>
        {/* <TouchableOpacity onLongPress={() => handleToggleMessageSelection({ message })}> */}
          <View style={styles.wrapperStyle}>
            <View style={styles.container}>
              {!isMessageDeleted &&
                <View style={styles.profileContainer}>
                    <Image source={hiBot} style={styles.profilePicture} />
                </View>
              }
  
                <View  style={styles.messageContainer}>
  
                
                    <View style={styles.nameContainer}>
                  
                      
                         <Text style={styles.nameText}>{userName}</Text>
                        
                            {
                            dateString && !isMessageDeleted && 
                            <View style={styles.timeContainer}>

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
                  
                    <View style={styles.questionContainer}>
                        <Text style={styles.question }>
                                {question}
                        </Text>
                    </View>

                    <View style={styles.optionsContainer}>
                    {/* <View style={styles.containerFlatList}> */}
                        {/* <View style={{ flex: 3}}>
                            <FlatList 
                            data={slides}
                            renderItem={renderItem}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            scrollEventThrottle={1}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                { useNativeDriver: false }
                            )}
                            />
                        </View>
                        <Paginator data={slides} scrollX={scrollX}/> */}
                     {/* </View> */}

                     {showExplanation ? explanationRender() : optionsElements}
                  </View>

                 
                    <View>
                      {explanation &&
                        <View style={styles.dotsContainer}>
                          <TouchableOpacity 
                            style={[styles.dot, showExplanation ? styles.dotInactive : styles.dotActive]} 
                            onPress={() => setShowExplanation(false)}
                          />
                          <TouchableOpacity 
                            style={[styles.dot, showExplanation ? styles.dotActive : styles.dotInactive]} 
                            onPress={() => setShowExplanation(true)}
                          />
                          
                        </View>
                      }
                      
                      {/* <TouchableOpacity style={styles.generateButton} >
                          <IoniconsIcon name="ios-refresh" color={colors.dark.text} size={15} />
                          <Text style={styles.buttonText}>Generate{'\n'}Similar</Text>
                      </TouchableOpacity> */}
                    </View>
                    
                    
                    
  
                </View>
               
            </View>
            <ThumbsContainer message={message} oneUser={oneUser()} />
          </View>
          
          {/* </TouchableOpacity> */}

          <Modal
            visible={modalOptionUsers} 
            transparent={true}
          >
            <View style={styles.modalContainer}>
          
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeIconContainer}
                  onPress={() => setModalOptionUsers(false)}
                >
                  <Ionicons name="close" size={20} color={colors.dark.secondaryLight} />
                </TouchableOpacity>
  
                <FlatList
                  data={optionUsers}
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={false}
                />
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
          flex: 1,
          paddingVertical: 5,
          marginVertical: 10,
      },
      container: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          flex: 1,
      },
      profileContainer: {
          marginRight: 10,
        },
        profilePicture: {
          width: 35,
          height: 35,
          borderRadius: 9,
        },
        messageContainer: {
          flex: 1,
        },
        questionContainer:{
          marginVertical: 5
        },
      question: {
          lineHeight: 22,
          fontSize: 14,
          color: '#dcddde',
          marginBottom: 0,
          fontWeight: 'bold'
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
          fontSize: 18,
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
      optionsContainer: {
        marginBottom: 10,
      },
      optionBox: {
        padding: 5,
        margin: 5,
        marginRight: 20,
        borderRadius: 15,
        borderWidth: 2,
      },
      optionText: {
        fontWeight: 'bold',
        fontSize: 13,
        flexShrink: 1,
      },
      optionLetter: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
        paddingLeft: 5
      },
      optionTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      
      containerFlatList:{
        flex: 1,
        justifyContent: 'center',
        alignItems:'center'
    },
    dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 5,
      marginBottom: 10,
      marginRight: 10
    },
    dot: {
      width: 9,
      height: 9,
      borderRadius: 5,
      marginHorizontal: 7
    },
    dotActive: {
      backgroundColor: '#859299',
    },
    dotInactive: {
      backgroundColor: 'rgba(133, 146, 153, 0.3)'
    },
    generateButton: {
      position: 'absolute',
      flexDirection: 'row',
      left: -40,  // Adjust the value as needed to position the button
      top: -5,   // Adjust the value as needed to position the button
      backgroundColor: colors.dark.secondary, // change this to whatever color you want for the button
      borderRadius: 10,
      padding: 8,
    },
    
    buttonText: {
      color: colors.dark.text, // change this to whatever color you want for the button text
      fontWeight: 'bold',
      textAlign: 'center',  
      fontSize: 9,
      marginLeft: 5
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
    closeIconContainer: {
      position: 'absolute',
      top: 7,
      right: 7,
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
  });