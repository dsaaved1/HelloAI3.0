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

import keys from '../../assets/constants/keys';
import youtube from '../../assets/images/youtube.png';
import camera from '../../assets/images/camera.png';
import gallery from '../../assets/images/gallery.png';
import microphone from '../../assets/images/microphone.png';
import code from '../../assets/images/code.png';
import library from '../../assets/images/library.png';
import file from '../../assets/images/file.png';

const ModalPoup = ({visible, onClose, takePhotoAI, pickImageAI, clearMemory}) => {
  const [showModal, setShowModal] = useState(visible);
  const [loading, setLoading] = useState(false);
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    toggleModal();
  }, [visible]);


  const onLoading = (value) => {
    setLoading(value);
  }

  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <Animated.View
          style={[styles.modalContainer, {transform: [{scale: scaleValue}]}]}>
                 <ScrollView 
                    horizontal={true} 
                    showsHorizontalScrollIndicator={false}
                    indicatorStyle={'white'} >
                        <View style={{flexDirection: 'row',justifyContent: 'space-evenly'}}>
                            <View >
                                <TouchableOpacity style={styles.mediaItem} onPress={takePhotoAI}>
                                    {loading && 
                                     <View style={{ ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center' }}>
                                        <ActivityIndicator size={'small'} color={"#3777f0"} />
                                      </View>
                                    }{
                                      <Image
                                        style={styles.mediImage}
                                        source={camera}
                                        onLoadStart={() => onLoading(true)}
                                        onLoadEnd={() => onLoading(false)}
                                      /> 
                                    }
                                    <Text style={styles.mediaText}>Camera</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.mediaItem} onPress={onClose}>
                                    {loading && 
                                       <View style={{ ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center' }}>
                                        <ActivityIndicator size={'small'} color={"#3777f0"} />
                                      </View>
                                    }{
                                      <Image
                                        style={styles.mediImage}
                                        source={code}
                                        onLoadStart={() => onLoading(true)}
                                        onLoadEnd={() => onLoading(false)}
                                      />
                                    }
                                    <Text style={styles.mediaText}>Code</Text>
                                </TouchableOpacity>
                            </View>

                            <View >
                                <TouchableOpacity style={styles.mediaItem} onPress={pickImageAI}>
                                    {loading && 
                                       <View style={{ ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center' }}>
                                        <ActivityIndicator size={'small'} color={"#3777f0"} />
                                      </View>
                                    }{
                                      <Image
                                        style={styles.mediImage}
                                        source={library}
                                        onLoadStart={() => onLoading(true)}
                                        onLoadEnd={() => onLoading(false)}
                                      />
                                    }
                                    <Text style={styles.mediaText}>Gallery</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.mediaItem} onPress={onClose}>
                                    {loading && 
                                       <View style={{ ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center' }}>
                                        <ActivityIndicator size={'small'} color={"#3777f0"} />
                                      </View>
                                    }{
                                      <Image
                                        style={styles.mediImage}
                                        source={youtube}
                                        onLoadStart={() => onLoading(true)}
                                        onLoadEnd={() => onLoading(false)}
                                      />
                                    }
                                    <Text style={styles.mediaText}>Youtube</Text>
                                </TouchableOpacity>
                            </View>

                            <View >
                                <TouchableOpacity style={styles.mediaItem} onPress={clearMemory}>
                                    <Image style={styles.mediImage} source={file} />
                                    <Text style={styles.mediaText}>Files</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.mediaItem} onPress={onClose}>
                                    <Image style={styles.mediImage} source={microphone} />
                                    <Text style={styles.mediaText}>Voice</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                  </ScrollView>
                        
                        <View style={styles.cancelContainer}>
                            <TouchableOpacity onPress={onClose}>
                              <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                         </View>
        </Animated.View>
      </View>
    </Modal>
  );
};


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
    const [visible, setVisible] = useState(false);
    const [visibleContainer, setVisibleContainer] = useState(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    let Container = visibleContainer ? View : Swipeable;
    const [messageText, setMessageText] = useState("");
    const {client} = useChatContext()
    const {updateMessage} = useMessagesContext()
    const {channel} = useChannelContext()
    const [power, setPower] = useState("image");
    const [messageImage, setMessageImage] = useState("");


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
    console.log("hereeee!!!!!!")
    await channel.updatePartial({ set:{ AIMessages: [{"role": "system", "content": "You are a helpful assistant."}] } });
    console.log("here")
  }

  const sendTextMessage = async () => {
    const messageData = {
      class: 'text',
      text: messageText,
    }

    await channel.sendMessage(messageData)
    setMessageText("");
  }

  const sendQuestionChatGPT = async (question) => {
    await sendQuestion()
    await sendChatGPT(question)
  }

  const sendQuestion = async () => {
    const messageData = {
      class: "AIQuestion",
      text: text,
    };

    // console.log(channel.cid, "channel")
    // console.log(newChannel.cid, "newChannel")
    // console.log(messageData, "messageData")
    messageInputRef?.current?.blur()
    await channel.sendMessage(messageData);
    setText("");
    
  };

  const sendChatGPT = async (question) => {
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
        console.log(convoData, "channel AI messages inside")
        convoData.push(questionChat);

        console.log("here in ai during response1")
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: convoData
        });
    
        const answer = response.data.choices[0].message.content
        
        console.log(answer)
        console.log("here in ai after response3")
        // console.log(answer)

        convoData.push({"role": "assistant", "content": answer})

        console.log("updating convo")
        await channel.updatePartial({ set:{ AIMessages: convoData } });


        const messageData = {
            question: question,
            model: 'GPT-3.5',
            modelAIPhoto: 'https://firebasestorage.googleapis.com/v0/b/mind-4bdad.appspot.com/o/chatImages%2Fchatgpt-icon.png?alt=media&token=c48f7085-0a25-4ea0-95a6-a7f3d6ed0cd4',
            text: answer,
            class: "AIAnswer",
        };


        await channel.sendMessage(messageData)

    } catch (e) {
        console.error("Error asking AI: ", e);
    }


  }

  const handleSendOnPress = async () => {

    // console.log("handleSendOnPress")
    // console.log(channel.cid, "channel")
    // console.log(newChannel.cid, "newChannel")
    messageInputRef?.current?.blur()
    await sendMessage()
  }

  const rightSwipeActions = () => {
    return (
      <View >
        <SafeAreaView style={{...styles.outerContainer, backgroundColor: '#E1DFDF'}}>
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
                        <IconButton
                          onPress={pickFile}
                          iconName={'Attachment'}
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
         </SafeAreaView>
      </View>
    )
  }


  return (
    <View>
      <Reply
            isPreview
            isEnabled={isReplyPreviewEnabled}
            message={quotedMessage}
          />
      <Container renderRightActions={rightSwipeActions}>
      <SafeAreaView style={{...styles.outerContainer, backgroundColor: colors.dark.secondary}}>
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
                    onPress={() => setVisible(true)}
                    iconName={'Plus'}
                    pathFill={colors.dark.secondaryLight}
                  />
                  <AutoCompleteInput
                    setInputBoxRef={
                      messageInputRef
                    }
                  />

            </PeekabooView>
            
          
              <MessageInputCTA
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
                          onPress={() => sendQuestionChatGPT(text)}
                          iconName={'Send'}
                          pathFill={colors.dark.text}
                          style={styles.send}
                        />
                    }
                    
                </PeekabooView>
           
          
            </View>
           </View>
        
          </SafeAreaView>
        <ModalPoup visible={visible} onClose={() => setVisible(false)} clearMemory={clearMemory}/>
      </Container>
    </View>
    
  )
}

export const messageInputStyle = {
  backgroundColor: colors.dark.secondary,
  //borderRadius: sizes.xl,
  //marginHorizontal: sizes.s,
}
const styles = StyleSheet.create({
  outerContainer: {
    ...flex.directionRowItemsEnd,
    flexDirection: 'row',
  },
  innerContainer: {
    backgroundColor: colors.dark.secondary,
    //flex: 1,
    alignItems: "center",
    //marginTop: 15,
    paddingRight: 15,
    width: '100%',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    paddingBottom: 20,
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
