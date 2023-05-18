import 'react-native-url-polyfill/auto';
import React, {useCallback, useEffect, useMemo, useState, useRef} from 'react'
import {
  AutoCompleteInput,
  LocalMessageInputContext,
  useAttachmentPickerContext,
  useMessageInputContext,
} from 'stream-chat-react-native'
import {takePhoto} from 'stream-chat-react-native-core/src/native'
import {Alert, SafeAreaView, StyleSheet, Text, View,  
TouchableOpacity, Image, TextInput, Animated,
Modal, ScrollView, ActivityIndicator} from 'react-native'
import {flex, sizes, globalStyles} from '../../global'
import {colors} from '../../theme'
import IconButton from '../IconButton'
import Reply from './Reply'
import {useAppContext} from '../../App'
import moment from 'moment'
import RecordingBlinking from '../../icons/RecordingBlinking'
import PeekabooView from '../PeekabooView'
import MessageInputCTA from './MessageInputCTA'
import {useNavigation} from '@react-navigation/native'
import {get, isEmpty, size, values} from 'lodash'
import {ChannelState} from 'stream-chat'
import {StackNavigatorParamList, StreamChatGenerics} from '../../types'
import {CHANNEL_STACK} from '../../stacks/ChannelStack'
import {StackNavigationProp} from '@react-navigation/stack'
import {
  useChannelContext,
  useChatContext,
  useMessagesContext,
} from 'stream-chat-react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {launchImageLibrary} from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';


import keys from '../../assets/constants/keys';
import youtube from '../../assets/images/youtube.png';
import camera from '../../assets/images/camera.png';
import gallery from '../../assets/images/gallery.png';
import microphone from '../../assets/images/microphone.png';
import code from '../../assets/images/code.png';
import library from '../../assets/images/library.png';
import file from '../../assets/images/file.png';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import FeatherIcons from 'react-native-vector-icons/Feather';
import EvilIconsIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesoem5Icons from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomAlert from '../BottomAlert';
import GPT3 from '../../images/GPT3.png'
import GPT4 from '../../images/GPT4.png'
import Bard from '../../images/Bard.png'
import { chatClient } from '../../client';
//import { SVGIcon } from '../SVGIcon';
import PaywallScreen from '../Paywall';




export default (props) => {
  const newChannel = props.newChannel
  const {
    editing,
    fileUploads,
    imageUploads,
    uploadNewImage,
    quotedMessage,
    text,
    compressImageQuality,
    pickFile,
    sendMessage,
    setText
  } = useMessageInputContext()
  const [recordingActive, setRecordingActive] = useState(false)
  const [recordingDurationInMS, setRecordingDurationInMS] = useState(0)
  const {closePicker, setSelectedImages, setSelectedPicker} =
    useAttachmentPickerContext()
  const {messageInputRef, 
    //channel
  } = useAppContext()
    const navigation = useNavigation()
    //const {navigate} = seNavigation<StackNavigationProp<StackNavigatorParamList>>()
    const [messageText, setMessageText] = useState("");
    const {client} = useChatContext()
    const {updateMessage} = useMessagesContext()
    const {channel} = useChannelContext()
    const [power, setPower] = useState("image");
    const [messageImage, setMessageImage] = useState("");
    const [currentModel, setCurrentModel] = useState("GPT-3.5");
    const [showPaywall, setShowPaywall] = useState(false);
    const [hasProAccess, setHasProAccess] = useState(false);

    

    const [showChatAIAlert, setShowChatAIAlert] = useState(false);
    const [showChatAlert, setShowChatAlert] = useState(false);
    const [showAIModel, setShowAIModel] = useState(false);

    const optionsModels = [
      {
        text: 'Cancel',
        onPress: () => setShowAIModel(false),
      },
      {
        text: 'GPT-3.5',
        icon: (
          <View style={{borderRadius:25}}>
            <Image source={GPT3} style={{borderRadius:25, width:25, height:25}}/>
          </View>
        ),
        onPress: () => {
          setCurrentModel("GPT-3.5")
          setShowAIModel(false)   
        },
      },
      {
        text: 'GPT-4',
        icon: (
          <View style={{borderRadius:25}}>
            {/* <SVGIcon height={15} type={'opeanai'} width={15} /> */}
            <Image source={GPT4} style={{borderRadius:25, marginLeft: -2, width:30, height:30}}/>
          </View>
        ),
        onPress: () => {
          setCurrentModel("GPT-4")
          setShowAIModel(false)
        },
      },
      {
        text: '...',
        icon:(
          <View style={{borderRadius:25}}>
            {/* {hasProAccess ?
            <Image source={Bard} style={{width:25, height:25}}/>
            : */}
            <IoniconsIcon name="lock-closed" size={18} color='#859299' />
            
          </View>
        ),
        onPress: () => {
          if (hasProAccess) {
          } else {
            setShowAIModel(false),
            setShowPaywall(true)
          }
        },
      },
    ];

    const chatOptionAI = [
      {
        text: 'Cancel',
        onPress: () => setShowChatAIAlert(false),
      },
      {
        text: 'Camera',
        icon: (
          <IoniconsIcon name="ios-camera-outline" color= '#3777f0' size={25} />
        ),
        onPress: () => {
          if (hasProAccess) {
          } else {
            setShowPaywall(true)
           setShowChatAIAlert(false)
            
          }
        },
      },
      {
        text: 'Photo & Video Library',
        icon: <FeatherIcons name="image" color= '#3777f0' size={25} />,
        onPress: () => {
          if (hasProAccess) {
          } else {
            setShowPaywall(true)
            setShowChatAIAlert(false)
           
          }
        },
      },
      {
        text: 'Poll',
        icon: <FontAwesoem5Icons name="poll-h" color= '#3777f0' size={25} solid />,
        onPress: () => {
          if (hasProAccess) {
          } else {
            setShowPaywall(true)
            setShowChatAIAlert(false)
            
          }
        },
      },
      {
        text: 'Refresh Conversation',
        icon: (
          <IoniconsIcon name="ios-refresh" color="#3777f0" size={25} />
        ),
        onPress: () => {clearMemory()},
      },
      {
        text: 'Choose AI Model',
        icon: (
          <MaterialCommunityIcons name="chat-question" color="#3777f0" size={25} />
        ),
        onPress: () => {
          setShowChatAIAlert(false)
          setShowAIModel(true)
        },
      },
    ];

    const chatOption = [
      {
        text: 'Cancel',
        onPress: () => setShowChatAlert(false),
      },
      {
        text: 'Camera',
        icon: (
          <IoniconsIcon name="ios-camera-outline" color= '#3777f0' size={25} />
        ),
        onPress: () => {
          setShowChatAlert(false),
          takeAndUploadImage()
        },
      },
      {
        text: 'Photo & Video Library',
        icon: <FeatherIcons name="image" color= '#3777f0' size={25} />,
        onPress: () => {
          setShowChatAlert(false),
          pickImageFromGallery()
        },
      },
      {
        text: 'Document',
        icon: (
          <IoniconsIcon
            name="md-document-outline"
            color= '#3777f0'
            size={25}
          />
        ),
        onPress: () => {pickFile()},
      },
      // {
      //   text: 'Location',
      //   icon: (
      //     <IoniconsIcon
      //       name="ios-location-outline"
      //       color= '#3777f0'
      //       size={25}
      //     />
      //   ),
      //   onPress: () => {},
      // },
      // {
      //   text: 'Contact',
      //   icon: <EvilIconsIcons name="user" color= '#3777f0' size={25} />,
      //   onPress: () => {},
      // },
      // {
      //   text: 'Poll',
      //   icon: <FontAwesoem5Icons name="poll-h" color= '#3777f0' size={25} solid />,
      //   onPress: () => {},
      // },
    ];

  const numberOfFiles = fileUploads.length
  const channelMembers = get(channel, [
    'state',
    'members',
  ])
  const numberOfMembers = size(channelMembers)
  const recipientChannelMemberName = get(values(channelMembers), [
    1,
    'user',
    'name',
  ])

  //use text before instead of messageText
  const isMessageEmpty = useMemo(
    () => !text && !imageUploads.length && !fileUploads.length,
    [text, imageUploads.length, fileUploads.length],
  )

  const takeAndUploadImage = useCallback(async () => {
    console.log("takeAndUploadImage")
    setSelectedPicker(undefined)
    closePicker()
    const photo = await takePhoto({compressImageQuality})
    if (!photo.cancelled) {
      await uploadNewImage(photo)
      navigation.navigate(CHANNEL_STACK.IMAGE_PREVIEW)
    }
  }, [closePicker, compressImageQuality, setSelectedImages, setSelectedPicker])



  const pickImageFromGallery = useCallback(async () => {
    console.log('pickImageFromGallery');
  
    const options = {
      mediaType: 'photo',
      quality: compressImageQuality,
    };
  
    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const photo = {
          uri: response.assets[0].uri,
          name: response.assets[0].fileName || `image-${Date.now()}.jpg`,
          type: response.assets[0].type || 'image/jpeg',
        };
  
        await uploadNewImage(response.assets[0].uri);
        navigation.navigate(CHANNEL_STACK.IMAGE_PREVIEW);
      }
    });
  }, [compressImageQuality]);


  //image uploads
  useEffect(() => {
    if (numberOfFiles === 0) return
    const allFilesAreReady = fileUploads.every(f => !isEmpty(f.url))

    if (!allFilesAreReady) return

    const fileUploadsDescription =
      numberOfFiles > 1
        ? `${numberOfFiles} files`
        : `'${get(fileUploads, [0, 'file', 'name'])}'`

    const membersDescription =
      numberOfMembers > 2
        ? `all ${numberOfMembers} members`
        : `${recipientChannelMemberName}`

    Alert.alert(
      'Send file/s',
      `Send ${fileUploadsDescription} to ${membersDescription}?`,
      [
        {onPress: () => null, text: 'Cancel'},
        {
          onPress: sendMessage,
          text: 'Send',
        },
      ],
      {cancelable: true},
    )
  }, [JSON.stringify(fileUploads)])


  const isReplyPreviewEnabled = Boolean(
    (typeof editing !== 'boolean' && editing?.quoted_message) || quotedMessage,
  )

  const formattedAudioDuration = useMemo(
    () => moment(recordingDurationInMS).format('m:ss'),
    [recordingDurationInMS],
  )

  const clearMemory = async () => {
    console.log("clearMemory")
    
    await channel.updatePartial({ set:{ AIMessages: [{"role": "system", "content": "You are a helpful assistant."}] } })
    
    const text = 'Conversation cleared';
    const message = {
        text,
        silent: true,
        type: 'system'
    };
    await channel.sendMessage(message);

    setShowChatAIAlert(false)
    
  }


  const sendQuestionGPT = async (question) => {
    if (chatClient?.user?.questionsLeft > 0 || chatClient?.user?.proAccess == true){
        await sendQuestion()
        if (currentModel == 'GPT-4'){
          await sendGPT4(question)
        } else {
          await sendGPT3(question)
        }
        if (!chatClient?.user?.proAccess){
          try {
            const currentQuestions = chatClient?.user?.questionsLeft
            const update = {
              id: chatClient.user.id,
              set: {
                  questionsLeft: currentQuestions - 1,
                
              },
            };
            await chatClient.partialUpdateUser(update);
          } catch (error) {
            console.error('Error updating questions left:', error);
          }
        }
    } else {
      console.log("Failed to send question AI")
      setText("");
      //que diga este no questions left
      setShowPaywall(true)
    }

   
  }

  const sendQuestion = async () => {
    const messageData = {
      class: "AIQuestion",
      text: text,
    };

    messageInputRef?.current?.blur()
    await channel.sendMessage(messageData);
    setText("");
    
  };

  const sendGPT4= async (question) => {
    const { Configuration, OpenAIApi } = require('openai')
    const configuration = new Configuration({
      apiKey: keys.ai,
    })
    const openai = new OpenAIApi(configuration)

    console.log("here in ai before response")
    try {
        const completeQuestion = question + messageImage
        const questionChat = {"role": "user", "content": completeQuestion}
        const convoData = channel.data.AIMessages
        convoData.push(questionChat);

        console.log("here in ai gpt-4 during response1")
        const response = await openai.createChatCompletion({
          model: "gpt-4",
          messages: convoData
        });
    
        const answer = response.data.choices[0].message.content
        
        console.log(answer)
        console.log("here in ai gpt-4 after response3")
        // console.log(answer)

        convoData.push({"role": "assistant", "content": answer})

        console.log("updating convo")
        await channel.updatePartial({ set:{ AIMessages: convoData } });


        const messageData = {
            question: question,
            model: 'GPT-4',
            modelAIPhoto:'https://firebasestorage.googleapis.com/v0/b/mind-4bdad.appspot.com/o/chatImages%2FGPT-4.png?alt=media&token=c9fadfd5-2088-407e-8ec0-b0b6b63bf0b8',
            text: answer,
            isAI: true,
            class: 'AIAnswer'
        };


        await channel.sendMessage(messageData)

    } catch (e) {
        console.error("Error asking AI GPT-4: ", e);
    }


  }

  const sendGPT3 = async (question) => {
    console.log(currentModel, "currentModel")
    const { Configuration, OpenAIApi } = require('openai')
    const configuration = new Configuration({
      apiKey: keys.ai,
    })
    const openai = new OpenAIApi(configuration)

    console.log("here in ai before response")
    try {
        const completeQuestion = question + messageImage
        const questionChat = {"role": "user", "content": completeQuestion}
        const convoData = channel.data.AIMessages
        convoData.push(questionChat);

        
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: convoData
        });
    
        const answer = response.data.choices[0].message.content

        convoData.push({"role": "assistant", "content": answer})

        await channel.updatePartial({ set:{ AIMessages: convoData } });


        const messageData = {
            question: question,
            model: 'GPT-3.5',
            modelAIPhoto: 'https://firebasestorage.googleapis.com/v0/b/mind-4bdad.appspot.com/o/chatImages%2Fchatgpt-icon.png?alt=media&token=c48f7085-0a25-4ea0-95a6-a7f3d6ed0cd4',
            text: answer,
            isAI: true,
            class: 'AIAnswer'
        };


        await channel.sendMessage(messageData)

    } catch (e) {
        console.error("Error asking AI: ", e);
    }


  }

  const handleSendOnPress = async () => {
    messageInputRef?.current?.blur()
    await sendMessage()
  }

  const rightSwipeActions = () => {
    return (
      <View style={{...styles.outerContainer, paddingBottom: recordingActive ? 20 : 0, backgroundColor: '#E1DFDF',flex:1}}>
        {/* <SafeAreaView style={{...styles.outerContainer, paddingBottom: recordingActive ? 20 : 0, backgroundColor: '#E1DFDF'}}> */}
        <PeekabooView isEnabled={!recordingActive}>
        <View style={{alignItems:'center',  widht:'100%', marginBottom: -11}}>
          <AntDesign name="swapleft" size={24} color={colors.dark.secondaryLight} />
        </View>
        </PeekabooView>
            <View style={{
              ...styles.innerContainer,
              backgroundColor: '#E1DFDF',
              ...(isReplyPreviewEnabled
                ? {borderTopRightRadius: sizes.ml, borderTopLeftRadius: sizes.ml}
                : {})
              }}>
                  <View style={flex.directionRowItemsCenter}>

                      <PeekabooView isEnabled={recordingActive}>
                        <RecordingBlinking />
                        <View style={{flex: 1}}>
                          <Text style={{color: colors.dark.secondaryLight}}>
                            {formattedAudioDuration}
                          </Text>
                        </View>
                    </PeekabooView>
                  

                    <PeekabooView isEnabled={!recordingActive}>
                        {/* <IconButton
                          onPress={pickFile}
                          iconName={'Attachment'}
                          pathFill={colors.dark.secondaryLight}
                        /> */}
                        <IconButton
                          onPress={() => setShowChatAlert(true)}
                          iconName={'Plus'}
                          pathFill={colors.dark.secondaryLight}
                        />

                        <AutoCompleteInput
                          setInputBoxRef={
                            messageInputRef
                          }
                        />
                        
                        {/* <IconButton
                          isEnabled={isMessageEmpty}
                          onPress={takeAndUploadImage}
                          iconName={'Camera'}
                          pathFill={colors.dark.secondaryLight}
                        /> */}
            
              
                  </PeekabooView>

                  <MessageInputCTA
                      pressable={true}
                      recordingActive={recordingActive}
                      setRecordingActive={setRecordingActive}
                      recordingDurationInMS={recordingDurationInMS}
                      setRecordingDurationInMS={setRecordingDurationInMS}
                    />
                  
                
                  <PeekabooView isEnabled={!recordingActive}>
                  {isMessageEmpty?
                      <IconButton
                        unpressable={true}
                        iconName={'Send'}
                        style={styles.send}
                      />
                  :
                    <IconButton
                        onPress={handleSendOnPress}
                        iconName={'Send'}
                        pathFill={colors.dark.secondary}
                        style={styles.send}
                      />
                  }
                  </PeekabooView>
              </View>

              
            </View>
         {/* </SafeAreaView> */}
         <BottomAlert
          visible={showChatAlert}
          actions={chatOption}
          textColor={colors.dark.text}
          withIcon={true}
        />

        
      </View>
    )
  }


  const oneUser = () => {
    return Object.keys(channel?.state?.members).length === 1
  }

  let Container = oneUser() ? View : Swipeable;

  return (
    <View>
      {!oneUser() &&
        <Reply
              isPreview
              isEnabled={isReplyPreviewEnabled}
              message={quotedMessage}
            />
      }
      <Container renderRightActions={rightSwipeActions}>
      <SafeAreaView style={{...styles.outerContainer, backgroundColor: colors.dark.secondary}}>
        {!oneUser() && 
          <View style={{alignItems:'center',  widht:'100%',  marginBottom: -11}}>
            <AntDesign name="swapright" size={24} color={colors.dark.secondaryLight} />
          </View>
        }
        <View
          style={{
           ...styles.innerContainer,
          backgroundColor: colors.dark.secondary,
          // backgroundColor: '#27272C',
            ...(isReplyPreviewEnabled
              ? {borderTopRightRadius: sizes.ml, borderTopLeftRadius: sizes.ml}
              : {}),  
          }}>
        
          <View style={flex.directionRowItemsCenter}>

          

              <PeekabooView isEnabled={recordingActive}>
                  <RecordingBlinking />
                  <View style={{flex: 1}}>
                    <Text style={{color: colors.dark.secondaryLight}}>
                      {formattedAudioDuration}
                    </Text>
                  </View>
              </PeekabooView>

              

              <PeekabooView isEnabled={!recordingActive}>
                  <IconButton
                    onPress={() => setShowChatAIAlert(true)}
                    iconName={'Plus'}
                    pathFill={colors.dark.secondaryLight}
                  />
                  <AutoCompleteInput
                    setInputBoxRef={
                      messageInputRef
                    }
                    placeholder="Your custom placeholder text"
                  />

            </PeekabooView>
            
          
                <MessageInputCTA
                    pressable={false}
                    //onPress={() => setShowPaywall(true)}
                    recordingActive={recordingActive}
                    setRecordingActive={setRecordingActive}
                    recordingDurationInMS={recordingDurationInMS}
                    setRecordingDurationInMS={setRecordingDurationInMS}
                  />
    

                <PeekabooView isEnabled={!recordingActive}>
                    {isMessageEmpty?
                        <IconButton
                          unpressable={true}
                          iconName={'Send'}
                          style={styles.send}
                        />
                    :
                      <IconButton
                          onPress={() => sendQuestionGPT(text)}
                          iconName={'Send'}
                          pathFill={colors.dark.text}
                          style={styles.send}
                        />
                    }
                    
                </PeekabooView>
           
          
            </View>
           </View>
        
          </SafeAreaView>
        
      </Container>
      <BottomAlert
          visible={showChatAIAlert}
          actions={chatOptionAI}
          textColor={colors.dark.text}
          withIcon={true}
        />
         <BottomAlert
          visible={showAIModel}
          actions={optionsModels}
          textColor={colors.dark.text}
          withIcon={true}
        />
        <Modal
           visible={showPaywall}
           animationType="slide"
           transparent={true}
        >

           <PaywallScreen onClose={() => setShowPaywall(false)} />

        </Modal>
    </View>
    
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    //...flex.directionRowItemsEnd,
    flexDirection: 'column',
  },
  innerContainer: {
    //backgroundColor: 'blue',
    //flex: 1,
    alignItems: "center",
    paddingRight: 15,
    width: '100%',
  },
  mediaButton: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  textbox: {
    flex: 1,
    borderRadius: 20,
    marginHorizontal: 15,
    paddingHorizontal: 12,
    minHeight: 30,
    fontSize: 16,
    maxHeight: 150,
    padding: 5,
    backgroundColor: '#1C1C1E',
  },
  aiButton: {
    backgroundColor: 'black',
    borderRadius: 50,
    width: 35,
    height: 35,
  },
  popupTitleStyle: {
    //fontFamily: 'medium',
    letterSpacing: 0.3,
    color: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 50,
  },
  sendButton: {
    width: 35,
    height: 35,
    borderRadius: 50,
    backgroundColor: '#3777f0',
  },
  send: {
    //backgroundColor: colors.dark.primaryLight,
    padding: 5,
    marginVertical: 0,
    borderRadius: 40,
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  modalContainer: {
    width: '80%',
    position: 'absolute',
    bottom: 50,
    backgroundColor: "#1C2333",
    //paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 30,
    elevation: 20,
  },
  mediaItem: {
    marginVertical: 20,
    marginHorizontal: 40,
    alignItems: 'center',
  },
  mediImage: {
    width: 80,
    height: 80,
  },
  mediaText: {
    color:"#fff", 
    //fontFamily:'bold',
    marginTop:5,
  },
  cancelContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 20,
  },
  cancelText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
