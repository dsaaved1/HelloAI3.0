import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Pressable, FlatList, ScrollView} from 'react-native';
import {colors} from '../theme'
import {Avatar} from 'stream-chat-react-native'
import { chatClient } from '../client';
import Ionicons from "react-native-vector-icons/Ionicons"
import keys from '../assets/constants/keys';
import {
  useMessageInputContext,
  useChannelContext,
} from 'stream-chat-react-native'

const ThumbsContainer = (props ) => {
  const {
    message,
    oneUser
  } = props;
  // const [thumbsUpCount, setThumbsUpCount] = useState(Object.keys(message?.thumbsUp || {}).length);
  // const [thumbsDownCount, setThumbsDownCount] = useState(Object.keys(message?.thumbsDown || {}).length);
  const [modalThumbsUp, setModalThumbsUp] = useState(false);
  const [modalThumbsDown, setModalThumbsDown] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showLoading, setShowLoading] = useState(false);
  const [showErrorAI, setShowErrorAI] = useState(false);
  const {channel} = useChannelContext()
  const { sendMessage } = useMessageInputContext()
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

      //setThumbsUpCount(prevCount => prevCount - 1);
    } else {
      // Add user ID to 'object'
      console.log("about to add user id into message thumbs up")
      const updatedObject = { ...messageThumbsUp, [userId]: { image: userImage, name: userName } };

      await chatClient.partialUpdateMessage(message?.id, {
        set: {
          thumbsUp: updatedObject
        }
      });

      //setThumbsUpCount(prevCount => prevCount + 1);
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

      //setThumbsUpCount(prevCount => prevCount - 1);
    } else {
      console.log("about to add user id into message thumbs down")
      // Add user ID to 'object'
      const updatedObject = { ...messageThumbsDown, [userId]: { image: userImage, name: userName } };

      await chatClient.partialUpdateMessage(message?.id, {
        set: {
          thumbsDown: updatedObject
        }
      });

      //setThumbsUpCount(prevCount => prevCount + 1);
    }
  };


  const handleCarouselChange = (index) => {
    setCarouselIndex(index);
  };

  
  const generateSimilar = async () => {
    const { Configuration, OpenAIApi } = require('openai')
    const configuration = new Configuration({
      apiKey: keys.ai,
    })
    const openai = new OpenAIApi(configuration)

    console.log("here in generate similar before response")

    try {

      const question = message?.question
      
      


      const messages = [
        {
          "content": "You are a helpful assistant.", 
          "role": "system"
        },
        {
          "role": "user",
          "content": `I have a question that says: "${question}". Could you generate a similar question on the same topic in the same language? Then, provide four multiple-choice options and label them as A, B, C, and D. Lastly, indicate the correct answer among A, B, C, D. For example: 
        Question: What is the color of the sky?
        A: Blue
        B: Green
        C: Yellow
        D: Red
        Answer: A
        `
        },
      ];
  
      const responseSimilar = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages
      });

      const answerSimilar = responseSimilar.data.choices[0].message.content

      // Split the response into lines
      let lines = answerSimilar.trim().split("\n");

      // Remove empty lines
      lines = lines.filter(line => line.trim() !== '');

      // The first line should be the question
      let questionResponse = lines[0].split(": ")[1];

      // The next 4 lines should be the options
      let options = lines.slice(1, 5).map(line => line.split(": ")[1]);

      let letter = lines[5].split(": ")[1].trim();
      console.log(answerSimilar, lines[5].split(": ")[1], "letter")
      let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      if (!alphabet.includes(letter) || options[0] === undefined) {
        throw new Error("Invalid letter response."); 
      }
      let answer = null;
      switch (letter) {
          case 'A': answer = 0; break;
          case 'B': answer = 1; break;
          case 'C': answer = 2; break;
          case 'D': answer = 3; break;
      }
 
    
      console.log(answer, " options")
      
        
        //multiple choice question
        const messageData = {
          question: questionResponse,
          options: options,
          answer: answer,
          isMultipleChoice: true,
          isQuiz: true,
          quizAnsweredUsers: ["someone"],
          model: "HelloAI",
          text: "Multiple Choice"
        };

        await channel.sendMessage(messageData);
    
    } catch (e) {    
      console.log(e.response ? e.response.data : e);

    }
  }

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

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handleThumbsUp} style={styles.iconContainer}>
          <Text style={styles.icon}>👍</Text>
          <Text style={styles.count}>{Object.keys(message?.thumbsUp || {}).length}</Text>
          
        </TouchableOpacity>
        {!oneUser &&
          <TouchableOpacity onPress={() => setModalThumbsUp(true)}>
            <Ionicons name="list-outline" size={18} color="white" />
          </TouchableOpacity>
        }
      </View>

      <View style={[
      styles.iconContainer,
      { marginRight: !message?.isMultipleChoice  ? 50 : 0 }
    ]}>
        <TouchableOpacity onPress={handleThumbsDown} style={styles.iconContainer}>
          <Text style={styles.icon}>👎</Text>
          <Text style={styles.count}>{Object.keys(message?.thumbsDown || {}).length}</Text>
        </TouchableOpacity>
        {!oneUser &&
          <TouchableOpacity onPress={() => setModalThumbsDown(true)}>
            <Ionicons name="list-outline" size={18} color="white" />
          </TouchableOpacity>
        }
      </View>
      {message?.isMultipleChoice &&
          <TouchableOpacity onPress={generateSimilar} style={styles.generateButton} >
            <Text style={styles.buttonText}>Generate Similar</Text>
        </TouchableOpacity>
      }

          <Modal
            visible={modalThumbsDown} 
            transparent={true}
          >
            <View style={styles.modalContainer}>
          
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeIconContainer}
                  onPress={() => setModalThumbsDown(false)}
                >
                  <Ionicons name="close" size={20} color={colors.dark.secondaryLight} />
                </TouchableOpacity>
  
                <FlatList
                  data={thumbsDownUsers}
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={false}
                />
             </View>
           
           </View>
          </Modal>

          <Modal
            visible={modalThumbsUp} 
            transparent={true}
          >
            <View style={styles.modalContainer}>
          
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeIconContainer}
                  onPress={() => setModalThumbsUp(false)}
                >
                  <Ionicons name="close" size={20} color={colors.dark.secondaryLight} />
                </TouchableOpacity>
  
                <FlatList
                  data={thumbsUpUsers}
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={false}
                />
             </View>
           
           </View>
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
            }}
          >
           <View style={styles.modalContainerr}>
           <Pressable onPress={() => {}} style={{width: '100%', alignItems:'center'}}>
             <View style={styles.modalContentt}>
               <Text style={styles.modalTitlee}>{`Error Asking HelloAI`}</Text>

             </View>
             </Pressable>
           </View>
           </Pressable>
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
    fontSize: 12,
  },
  count: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
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
  button: {
    backgroundColor: '#007BFF',
    //backgroundColor: '#337ab7',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonTextt: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  generateButton: {
    //backgroundColor: '#6495ED',
    backgroundColor: '#007BFF',
    paddingHorizontal: 5,
    paddingVertical: 8,
    borderRadius: 8,
  },
  
  buttonText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',  
  },
  modalContainerr: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContentt: {
    backgroundColor: '#1C2333',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
    elevation: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitlee: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D94444',
    marginBottom: 10,
  },
});

export default ThumbsContainer;