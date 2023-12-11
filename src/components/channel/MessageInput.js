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
Modal, ScrollView, ActivityIndicator, Pressable, KeyboardAvoidingView} from 'react-native'
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
import {get, isEmpty, size, transform, values} from 'lodash'
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
import SimpleIcons from 'react-native-vector-icons/SimpleLineIcons'
import BottomAlert from '../BottomAlert';
import BottomLoading from '../BottomLoading'
import QuizzesAlert from '../QuizzesAlert';
import GPT3 from '../../images/GPT3.png'
import GPT4 from '../../images/GPT4.png'
import Bard from '../../images/Bard.png'
import { chatClient } from '../../client';
//import { SVGIcon } from '../SVGIcon';
import PaywallScreen from '../Paywall';
import { SVGIcon } from '../SVGIcon';

import { launchImagePickerAI, openCameraAI, launchImagePicker} from '../../utils/imagePickerHelper';



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
    setText,
    clearQuotedMessageState,
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
    const [showMultipleChoice, setShowMultipleChoice] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [showQuizzesAlert, setShowQuizzesAlert] = useState(false);
    const [showErrorAI, setShowErrorAI] = useState(false);
    const [showFullMemory, setShowFullMemory] = useState(false);
    const [showReplyError, setShowReplyError] = useState(false);
    const [questionFailed, setQuestionFailed] = useState('')

  
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
      // {
      //   text: 'Summary',
      //   icon: (
      //     <SimpleIcons name="book-open" color= '#3777f0' size={21} />
      //   ),
      //   onPress: () => {
      //     if (hasProAccess) {
      //     } else {
      //       setShowPaywall(true)
      //      setShowChatAIAlert(false)
            
      //     }
      //   },
      // },
      {
        text: 'Multiple Choice',
        icon: <View style={{justifyContent:'center', marginRight: -4}}>
         
            <SVGIcon height={28} fill={'#3777f0'} type={'multiple'} width={28} />
      
          </View>
        ,
        onPress: () => {
          if (hasProAccess) {
          } else {
            setShowChatAIAlert(false)
            setShowMultipleChoice(true)

            
           
          }
        },
      },
      {
        text: 'Manual Quiz',
        icon: <FontAwesoem5Icons name="poll-h" color= '#3777f0' size={25} solid />,
        onPress: () => {
          if (hasProAccess) {
          } else {
            //setShowPaywall(true)
            setShowChatAIAlert(false)
  
            navigation.navigate('Quiz', { onSubmit: onSubmitQuiz });

      
            //setShowQuizzesAlert(true)
            
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

    const multipleChoiceOptions = [
      {
        text: 'Cancel',
        onPress: () => setShowMultipleChoice(false),
      },
      {
        text: 'Camera',
        icon: (
          <IoniconsIcon name="ios-camera-outline" color= '#3777f0' size={25} />
        ),
        onPress: () => {
          setShowMultipleChoice(false)
        },
      },
      {
        text: 'Library',
        icon: <FeatherIcons name="image" color= '#3777f0' size={25} />,
        onPress: () => {
           // setShowPaywall(true)
            //multipleChoice("k");
            (async () => {
              setShowMultipleChoice(false)
              //const tempUri = await launchImagePicker();
              const transcript = await pickImageAI();
              multipleChoice(transcript);
            })();
          
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

  const pickImageAI = useCallback(async () => {
    try {
      
      const result = await launchImagePickerAI();
      if (!result || result.text === "This image doesn't contain any text!") return "";


      return result.text

    } catch (error) {
      console.log(error);
      return ""; 
    }
  }, []);

  const openImageAI = useCallback(async () => {
    try {
      
      const result = await openCameraAI();
      if (!result) return "";

      return result.text

    } catch (error) {
      console.log(error);
      return ""; 
    }
  }, []);

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

  const onSubmitQuiz = async (prompt, question, optionValues) => {
    setShowQuizzesAlert(false)
    setShowLoading(true)
    const { Configuration, OpenAIApi } = require('openai')
    const configuration = new Configuration({
      apiKey: keys.ai,
    })
    const openai = new OpenAIApi(configuration)
    console.log("here in quiz on submit before response")
    try {
          const promptExists = prompt !== "AI Generate"
          const questionExists = question !== "AI Generate"
          const optionValuesExists = optionValues[0] !== "AI Generate"

          let completePrompt;
          let questionResponse
          let options
          let answer;

          if (questionExists && optionValuesExists){
            let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            let optionsPrompt = optionValues.map((option, index) => `${alphabet[index]}: ${option}`).join('\n');
        
            completePrompt = `Give me the answer to this question ${question}\n${optionsPrompt}\n${alphabet[optionValues.length]}: None of the above\n\nPlease answer with a single letter corresponding to the correct option. For example, if the answer is the second option, you should reply with The answer is C`;
        
            options = [...optionValues, "None of the above"]
            console.log(optionValues, options, "options")
            questionResponse = question
        
            const messages = [
                {
                    "content": "You are a helpful assistant.", 
                    "role": "system"
                },
                {
                    "role": "user",
                    "content": completePrompt
                },
            ];
                
            const responseSimilar = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: messages
            });
        
            const answerSimilar = responseSimilar.data.choices[0].message.content
        
            let letter = answerSimilar.split(" ")[3].trim(); 
            letter = letter.replace(/[^A-Z]/g, '');
            
            console.log(answerSimilar, letter, "letter in A")
        
            // Check if letter is valid
            if (alphabet.includes(letter)) {
          
                let letterToIndexMap = {};
                for(let i = 0; i < alphabet.length; i++){
                    letterToIndexMap[alphabet[i]] = i;
                }

                answer = letterToIndexMap[letter.trim()]; 
            } else {
              throw new Error("Invalid letter response.");
            }
         
        } else if (promptExists && questionExists) {
            completePrompt = `Given this prompt ${prompt} and this question ${question} provide me four multiple-choice options and label them as A, B, C, and D. Lastly, indicate the correct answer among A, B, C, D. For example: 
            Question: What is the color of the sky?
            A: Blue
            B: Green
            C: Yellow
            D: Red
            Answer: A
            `
            questionResponse = question

            const messages = [
              {
                "content": "You are a helpful assistant.", 
                "role": "system"
              },
              {
                "role": "user",
                "content": completePrompt
              },
            ];
            const responseSimilar = await openai.createChatCompletion({
              model: "gpt-3.5-turbo",
              messages: messages
            });

            const answerSimilar = responseSimilar.data.choices[0].message.content

            console.log(answerSimilar, "wilis B")

            // Split the response into lines
            let lines = answerSimilar.trim().split("\n");
    
            // Remove empty lines
            lines = lines.filter(line => line.trim() !== '');
    
    
            // The next 4 lines should be the options
            options = lines.slice(1, 5).map(line => line.split(": ")[1]);
    
            let letter = lines[5].split(": ")[1].trim();
            console.log(lines[5].split(": ")[1], "letter in B")

            let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            if (!alphabet.includes(letter) || options[0] === undefined) {
              throw new Error("Invalid letter response."); 
            }
            answer = null;
            switch (letter) {
                case 'A': answer = 0; break;
                case 'B': answer = 1; break;
                case 'C': answer = 2; break;
                case 'D': answer = 3; break;
            }

        } else if (promptExists) {
          console.log("here in prompt")
            completePrompt = `Given this prompt ${prompt}. Give me a question with four multiple-choice options and label them as A, B, C, and D. Lastly, indicate the correct answer among A, B, C, D. For example: 
            Question: What is the color of the sky?
            A: Blue
            B: Green
            C: Yellow
            D: Red
            Answer: A
            `
            const messages = [
              {
                "content": "You are a helpful assistant.", 
                "role": "system"
              },
              {
                "role": "user",
                "content": completePrompt
              },
            ];

            console.log(completePrompt, "complete prompt")

            const responseSimilar = await openai.createChatCompletion({
              model: "gpt-3.5-turbo",
              messages: messages
            });
    
            console.log(responseSimilar, "response")
            const answerSimilar = responseSimilar.data.choices[0].message.content

            console.log(answerSimilar, "wilis C")
    
            // Split the response into lines
            let lines = answerSimilar.trim().split("\n");
    
            // Remove empty lines
            lines = lines.filter(line => line.trim() !== '');
    
            // The first line should be the question
            questionResponse = lines[0].split(": ")[1];
    
            // The next 4 lines should be the options
            options = lines.slice(1, 5).map(line => line.split(": ")[1]);
    
            let letter = lines[5].split(": ")[1].trim();
            console.log(lines[5].split(": ")[1], "letter in C")
            let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            if (!alphabet.includes(letter) || options[0] === undefined) {
              throw new Error("Invalid letter response."); 
            }
            answer = null;
            switch (letter) {
                case 'A': answer = 0; break;
                case 'B': answer = 1; break;
                case 'C': answer = 2; break;
                case 'D': answer = 3; break;
            }

        } else if (questionExists) {
           completePrompt = `Given this question ${question} provide me four multiple-choice options and label them as A, B, C, and D. Lastly, indicate the correct answer among A, B, C, D. For example: 
            Question: What is the color of the sky?
            A: Blue
            B: Green
            C: Yellow
            D: Red
            Answer: A
            `
            questionResponse = question

            const messages = [
              {
                "content": "You are a helpful assistant.", 
                "role": "system"
              },
              {
                "role": "user",
                "content": completePrompt
              },
            ];
            const responseSimilar = await openai.createChatCompletion({
              model: "gpt-3.5-turbo",
              messages: messages
            });

            const answerSimilar = responseSimilar.data.choices[0].message.content

            console.log(answerSimilar, "wilis D")

            // Split the response into lines
            let lines = answerSimilar.trim().split("\n");
    
            // Remove empty lines
            lines = lines.filter(line => line.trim() !== '');
    
    
            // The next 4 lines should be the options
            options = lines.slice(1, 5).map(line => line.split(": ")[1]);
    
            let letter = lines[5].split(": ")[1].trim();
            console.log(lines[5].split(": ")[1], "letter in D")
            let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            if (!alphabet.includes(letter) || options[0] === undefined) {
              throw new Error("Invalid letter response."); 
            }
            answer = null;
            switch (letter) {
                case 'A': answer = 0; break;
                case 'B': answer = 1; break;
                case 'C': answer = 2; break;
                case 'D': answer = 3; break;
            }
        }
       
       
      
        setShowLoading(false)

          //multiple choice question
          const messageData = {
            question: questionResponse,
            options: options,
            answer: answer,
            isMultipleChoice: true,
            isQuiz: true,
            quizAnsweredUsers: ["someone"],
            model: "HelloAI",
            text: "Multiple Choice",
            //isAI: true,
          };

          await channel.sendMessage(messageData);
          
    } catch (e) {
        setShowLoading(false)
        console.log(e.response ? e.response.data : e);
        setCurrentModel("HelloAI")
        setShowErrorAI(true)
      
    }
  }

  const multipleChoice = async (transcript) => {
    if (transcript === "" || transcript === "This image doesn't contain any text!") {
      console.log("Empty transcript received");
      return;  // return early from the function if transcript is empty
    }
    setShowChatAIAlert(false)
    setShowLoading(true)
    const { Configuration, OpenAIApi } = require('openai')
    const configuration = new Configuration({
      apiKey: keys.ai,
    })
    const openai = new OpenAIApi(configuration)
  
    console.log("here in multiple choice before response")
    try {
       

      completePrompt = `Given this question ${transcript} provide me the multiple-choice options by labeling them as A, B, C, D, etc. Lastly, indicate the correct answer among A, B, C, D, etc with its explanation. Do it in this format below.: 
      Question: What is the color of the sky?
      A: Blue
      B: Green
      C: Yellow
      D: Red
      Answer: A
      Explanation: The blue color of the sky is primarily caused by Rayleigh scattering. This phenomenon occurs because molecules and small particles in the Earth's atmosphere scatter sunlight in all directions. Blue light from the sun is scattered more than other colors because it travels as shorter, smaller waves. 
      `
      
      const messages = [
        {
          "content": "You are a helpful assistant.", 
          "role": "system"
        },
        {
          "role": "user",
          "content": completePrompt
        },
      ];

      const responseSimilar = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages
      });

      const answerSimilar = responseSimilar.data.choices[0].message.content

      console.log(answerSimilar, "answer multiple choice easy way")

      // Split the response into lines
      let lines = answerSimilar.trim().split("\n");
    
      // Remove empty lines
      const filteredLines = lines.filter(line => line.trim() !== '');

      console.log(filteredLines, "filtered lines")

      // Define the alphabet
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');  

      console.log("Im here before question")
      // Extract question
      const questionLine = filteredLines.find(line => line.startsWith("Question: "));
      const question = questionLine ? questionLine.split(": ")[1] : "";

      console.log('question')

      // Extract options
      let options = [];
      let i = 1;
      while (filteredLines[i] && filteredLines[i].startsWith(`${alphabet[i - 1]}: `)) {
        options.push(filteredLines[i].split(": ")[1]);
        i++;
      }

      // Determine the answer letter
      const answerLetterLine = filteredLines[i];
      const letter = answerLetterLine.split(": ")[1].trim();

      
      if (!alphabet.includes(letter) || options[0] === undefined) {
        throw new Error("Invalid letter response.");
      }

      let answer = alphabet.indexOf(letter); // Convert letter to index

      // Extract explanation
      const explanationIndex = filteredLines.findIndex(line => line.startsWith("Explanation: "));
      const explanation = explanationIndex !== -1 ? filteredLines[explanationIndex].split(": ")[1] : "";

      console.log("Options:", options);
      console.log("Answer:", answer);
      console.log("Explanation:", explanation);
        // console.log(transcript, "transcript")
        // console.log("here in ai fine tuned during response1")
        // const response = await openai.createCompletion({
        //   model: "davinci:ft-personal-2023-06-01-21-41-13",
        //   prompt: transcript + "\n\n###\n\n",
        //   max_tokens: 300,  // Adjust this value as needed
        //   stop: ["###"]
        // });
    
        // const answer = response.data.choices[0].text.trim();
        
        // console.log("here in ai ai fine tuned after response2")
        // console.log(answer, "answer fine tuned")

    
        setShowLoading(false)
        //const input = "1. Sign tracking is also called&sign monitoring#autotracking#autoshaping#autotrack&c*2. The first person to use counterconditioning to treat a phobia was probably&Rosalie Rayner#Carl Rogers#Mary Cover Jones#John B. Watson&c*3. When a behaviour is defined by the procedure used to measure it, the definition is said to be&mechanistic#lexicographic#procedura#operational&d*4. Of the following, the schedule that is most likely to produce a superstitious behaviour is the&FD#VD#DRH#VT&b*5. The time between conditioning trials is called the&inter-stimulus interval#inter-trial interval#contiguity gap#trace period&b*6. If, following conditioning, a CS is repeatedly presented without the US, the procedure is&higher-order conditioning#latent inhibition#extinction.#preconditioning&c"

        // const questions = answer.split('*');
        // console.log(questions, " questions!!")

        // for (let i = 0; i < questions.length - 1; i++) {
        //   console.log(i, "number i")
        //   const parts = questions[i].split('&');
        //   console.log(parts, "parts")
        //   const question = parts[0];
        //   const options = parts[1].split('#');
        //   console.log(parts[2], "answer letter")
        //   const answer = parts[2].charCodeAt(0) - 97; // Convert the answer from 'a', 'b', 'c', 'd' to 0, 1, 2, 3

        //   const messageData = {
        //     question: question,
        //     options: options,
        //     answer: answer,
        //     isMultipleChoice: true,
        //     model: "HelloAI",
        //     text: "Multiple Choice"
        //   };

        //   if (parts[3]) {
        //     messageData.explanation = parts[3];
        //   }

        //   if (parts[4]) {
        //     messageData.answerExplanation = parts[4];
        //   }

        //   await channel.sendMessage(messageData);
        // }

        const messageData = {
          question: question,
          options: options,
          answer: answer,
          isMultipleChoice: true,
          model: "HelloAI",
          text: "Multiple Choice",
          //isAI: true,
        }; 

        if (explanation) {
          messageData.explanation = explanation;
        }


        await channel.sendMessage(messageData);
    } catch (e) {
      setShowLoading(false)
      console.log(e.response ? e.response.data : e);
      setCurrentModel("HelloAI")
      setShowErrorAI(true)
      
    
    }
  }

  const optimizeMemory = async () => {
    const { Configuration, OpenAIApi } = require('openai');
    const configuration = new Configuration({
      apiKey: keys.ai,
    });
    const openai = new OpenAIApi(configuration);
  
    console.log("Here before optimizing");
    try {
      const convoData = channel.data.AIMessages;
  
      const userQuestions = [];
      const assistantAnswers = [];
  
      // Extract user questions and assistant answers from the conversation data
      for (const message of convoData) {
        if (message.role === "user") {
          userQuestions.push(message.content);
        } else if (message.role === "assistant") {
          assistantAnswers.push(message.content);
        }
      }

      console.log(userQuestions.join(" "), "User questions")
      console.log(assistantAnswers.join(" "), "Answer questions")

      const optimizedSummary = [
        {
          "content": "You are a helpful assistant.", 
          "role": "system"
        },
        {
          "role": "user",
          "content": `give me a summary of max 500 words of these user questions, make sure you don't miss any point in the paragraph: ${userQuestions.join(" ")}`,
        },
      ];
  

      const responseSummary = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: optimizedSummary
      });
  
      const questionsSummary = responseSummary.data.choices[0].message.content

      console.log(questionsSummary, "questions Summary")

      const optimizedSummaryAnswers = [
        {
          "content": "You are a helpful assistant.", 
          "role": "system"
        },
        {
          "role": "user",
          "content": `give me a summary of max 500 words of this assitant answers to me, make sure you don't miss any point in the paragraph: ${userQuestions.join(" ")}`,
        },
      ];
  

      const responseSummaryAnswers = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: optimizedSummaryAnswers
      });
  
      const answersSummary = responseSummaryAnswers.data.choices[0].message.content
  
     console.log(answersSummary, "answers Summary")
  
      const optimizedData = [
        {
          "content": "You are a helpful assistant.", 
          "role": "system"
        },
        {
          "role": "user",
          "content": questionsSummary,
        },
        {
          "role": "assistant",
          "content": answersSummary,
        },
      ];
  
  
      await channel.updatePartial({ set: { AIMessages: optimizedData } });
  
      setShowLoading(false);
    } catch (e) {
      setShowLoading(false);
      if (
        e.message === 'StreamChat error code 22: UpdateChannelPartial failed with error: "channel custom data cannot be bigger than 5KB"'
      ) {
        setShowFullMemory(true);
      } else {
        console.log("Here in show", e);
        setQuestionFailed(question);
        setShowErrorAI(true);
      }
    }
  };

  const sendQuestionGPT = async (question) => {
    if (chatClient?.user?.questionsLeft > 0 || chatClient?.user?.proAccess == true){
        await sendQuestion()
        if (currentModel == 'GPT-4'){
          setShowLoading(true)
          await sendGPT4(question)
        } else {
          setShowLoading(true)
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

  const sendReplyGPT = async (question) => {

    console.log("here in send reply gpt")

    if (quotedMessage.class !== "AIQuestion"){
      await sendQuestion()
      if (currentModel == 'GPT-4'){
        setShowLoading(true)
        await sendGPT4(question)
      } else {
        setShowLoading(true)
        await replyGPT3(question)
      }
    } else {
    
      messageInputRef?.current?.blur()
      setText("");
      clearQuotedMessageState()
      setShowReplyError(true)
      
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
        console.log(convoData)
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

       
        const messageData = {
            question: question,
            model: 'GPT-4',
            modelAIPhoto:'https://firebasestorage.googleapis.com/v0/b/mind-4bdad.appspot.com/o/chatImages%2FGPT-4.png?alt=media&token=c9fadfd5-2088-407e-8ec0-b0b6b63bf0b8',
            text: answer,
            isAI: true,
            class: 'AIAnswer'
        };


        await channel.sendMessage(messageData)

        console.log("updating convo")
        await channel.updatePartial({ set:{ AIMessages: convoData } });

        setShowLoading(false)
    } catch (e) {
      setShowLoading(false)
      if (
        e.message === 'StreamChat error code 22: UpdateChannelPartial failed with error: "channel custom data cannot be bigger than 5KB"'
      ) {
        optimizeMemory()
      } else {
        setQuestionFailed(question)
        setShowErrorAI(true)
      }
    }


  }

  const sendGPT3 = async (question) => {
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

       

        const messageData = {
            question: question,
            model: 'GPT-3.5',
            modelAIPhoto: 'https://firebasestorage.googleapis.com/v0/b/mind-4bdad.appspot.com/o/chatImages%2Fchatgpt-icon.png?alt=media&token=c48f7085-0a25-4ea0-95a6-a7f3d6ed0cd4',
            text: answer,
            isAI: true,
            class: 'AIAnswer'
        };


        await channel.sendMessage(messageData)

        await channel.updatePartial({ set:{ AIMessages: convoData } });

        setShowLoading(false)

    } catch (e) {
      setShowLoading(false)
      if (
        e.message === 'StreamChat error code 22: UpdateChannelPartial failed with error: "channel custom data cannot be bigger than 5KB"'
      ) {
        optimizeMemory()
      } else {
        console.log("heree in show 2", e, question)
        setQuestionFailed(question)
        setShowErrorAI(true)
      }
        
    }


  }

  const replyGPT3 = async (question) => {
  
    const { Configuration, OpenAIApi } = require('openai')
    const configuration = new Configuration({
      apiKey: keys.ai,
    })
    const openai = new OpenAIApi(configuration)

    console.log("here in reply AI before response")
    try {

        const AIMessages = [{"role": "system", "content": "You are a helpful assistant."}]

        let optionsString = '';

        if (quotedMessage.options) {
          // Create an array of options with a., b., c. etc prepended
          let formattedOptions = quotedMessage.options.map((option, index) => 
            String.fromCharCode(97 + index) + '. ' + option
          );
          // Join all options into a single string
          optionsString = ' ' + formattedOptions.join(' ');
        }


        const questionUser = quotedMessage.question + optionsString;


        const questionChat = {"role": "user", "content": questionUser}
  
        AIMessages.push(questionChat);

        let explanationString = quotedMessage.explanation ? ' ' + quotedMessage.explanation : '';

        let answerAI = '';

        if (quotedMessage.answer) {
          answerAI = 'The answer is ' + quotedMessage.answer + ' because ' + explanationString;
        } else if (quotedMessage.answerExplanation) {
          answerAI = quotedMessage.answerExplanation;
        } else { 
          answerAI = quotedMessage.text
        }
        

        const answerChat = {"role": "assistant", "content": answerAI}

        AIMessages.push(answerChat);


        const questionReply = {"role": "user", "content": question}
  
        AIMessages.push(questionReply);

        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: AIMessages
        });
    
        const answer = response.data.choices[0].message.content

        const messageData = {
            question: question,
            model: 'GPT-3.5',
            modelAIPhoto: 'https://firebasestorage.googleapis.com/v0/b/mind-4bdad.appspot.com/o/chatImages%2Fchatgpt-icon.png?alt=media&token=c48f7085-0a25-4ea0-95a6-a7f3d6ed0cd4',
            text: answer,
            isAI: true,
            class: 'AIAnswer'
        };

        clearQuotedMessageState()

        await channel.sendMessage(messageData)


        setShowLoading(false)

    } catch (e) {
      setShowLoading(false)
      if (
        e.message === 'StreamChat error code 22: UpdateChannelPartial failed with error: "channel custom data cannot be bigger than 5KB"'
      ) {
        optimizeMemory()
      } else {
        console.log(e, "heree in show 3")
        setQuestionFailed(question)
        setShowErrorAI(true)
      }
        
    }
  }

  const handleSendOnPress = async () => {
    messageInputRef?.current?.blur()
    await sendMessage()
  }

  const oneUser = () => {
    return Object.keys(channel?.state?.members).length === 1
  }

  const handleTryAgain = async () => {
    setShowErrorAI(false)
    if (currentModel === 'GPT-4') {
      console.log("here before sending gpt4")
      setShowLoading(true);
      await sendGPT4(questionFailed);
    } else {
      setShowLoading(true);
      await sendGPT3(questionFailed);
    }
  };

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
                          //onPress={() => setShowChatAlert(true)}
                          pressable={false}
                          iconName={'Plus'}
                          pathFill={'#E1DFDF'}
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

  let Container = oneUser() ? View : Swipeable;

  return (
    
    <View>
      
        <Reply
              isPreview
              isEnabled={isReplyPreviewEnabled}
              message={quotedMessage}
            />
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
                          onPress={() => isReplyPreviewEnabled ? sendReplyGPT(text) : sendQuestionGPT(text)}
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
        <BottomAlert
          visible={showMultipleChoice}
          actions={multipleChoiceOptions}
          textColor={colors.dark.text}
          withIcon={true}
        />
        <BottomLoading
          visible={showLoading}
        />
        {/* <QuizzesAlert
           visible={showQuizzesAlert}
           onPress={() => setShowQuizzesAlert(false)}
           onSubmit={onSubmitQuiz}
        /> */}

        <Modal
           visible={showPaywall}
           animationType="slide"
           transparent={true}
        >

           <PaywallScreen onClose={() => setShowPaywall(false)} />

        </Modal>

        <Modal
           visible={showErrorAI}
           //animationType="slide"
           transparent={true}
       >
        <Pressable
            style={{ flex: 1 }}
            onPress={() => {
              setShowErrorAI(false);
              setCurrentModel("GPT-3.5")
            }}
          >
           <View style={styles.modalContainer}>
           <Pressable onPress={() => {}} style={{width: '100%', alignItems:'center'}}>
             <View style={styles.modalContent}>
               <Text style={styles.modalTitle}>{`Error Asking ${currentModel}`}</Text>

              {(currentModel === "GPT-3.5" || currentModel === "GPT-4") && 
              <View style={{flexDirection:'row'}}>
                <TouchableOpacity
                onPress={handleTryAgain}>
                  <Text
                    style={{ fontSize: 15,
                      color: colors.dark.secondaryLight,
                    marginBottom: 10,
                    marginRight: 5}}
                  >
                      Try Again
                  </Text>
                </TouchableOpacity>
                <IoniconsIcon name="ios-refresh" color={colors.dark.secondaryLight} size={15} />
              </View>
              }
             </View>
             </Pressable>
           </View>
           </Pressable>
        </Modal>

       <Modal
           visible={showReplyError}
           //animationType="slide"
           transparent={true}
       >
        <Pressable
            style={{ flex: 1 }}
            onPress={() => {
              setShowReplyError(false);
            }}
          >
           <View style={styles.modalContainer}>
           <Pressable onPress={() => {}} style={{width: '100%', alignItems:'center'}}>
             <View style={styles.modalContent}>
               <Text style={{...styles.modalTitle, color: colors.dark.text}}>Error replying to non AI answer!</Text>
              <Text style={{ fontSize: 12, color: colors.dark.text }}>
                You can only reply to an AI answer, not an AI question.
              </Text>
             </View>
             </Pressable>
           </View>
           </Pressable>
        </Modal>

        <Modal
           visible={showFullMemory}
           //animationType="slide"
           transparent={true}
       >
        <Pressable
            style={{ flex: 1 }}
            onPress={() => {
              setShowFullMemory(false);
            }}
          >
           <View style={styles.modalContainer}>
           <Pressable onPress={() => {}} style={{width: '100%', alignItems:'center'}}>
             <View style={styles.modalContent}>
               <Text style={{...styles.modalTitle, color: colors.dark.text}}>Memory Conversation Full!</Text>

              <View style={{flexDirection:'row'}}>
                <TouchableOpacity
                onPress={clearMemory}>
                  <Text
                    style={{ fontSize: 15,
                      color: colors.dark.secondaryLight,
                    marginBottom: 10,
                    marginRight: 5}}
                  >
                      Refresh Conversation
                  </Text>
                </TouchableOpacity>
                <IoniconsIcon name="ios-refresh" color={colors.dark.secondaryLight} size={15} />
              </View>
              <Text style={{ fontSize: 12, color: colors.dark.text }}>
                New questions and answers won't be remembered in this channel, but past ones will be. Press refresh to clear all
                memory in this channel.
              </Text>
             </View>
             </Pressable>
           </View>
           </Pressable>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: '#1C2333',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
    elevation: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D94444',
    marginBottom: 10,
  },
  
})
