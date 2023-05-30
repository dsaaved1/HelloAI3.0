import uuid from 'react-native-uuid';
import {chatClient} from '../../client'


function getRandomColor() {
    const colors = ['#6653FF', '#53FF66', '#FF6653', '#BC53FF', '#19C37D', '#FFFF66', '#3F22EC', '#FF6EFF', '#FF9933'];
    
    return colors[Math.floor(Math.random() * colors.length)];
}


export const createGroupChat = async (userId, client, chatName, channelMembers, isGroupChat, tempImageUri) => {
    try {

        const channel = client.channel('messaging',  uuid.v4(), {
          isGroupChat: isGroupChat,
          name: chatName,
          typeChat: 'chat',
          image: tempImageUri
        });
    

        const userArray = [userId]
        
        await channel.create();
        await channel.addMembers([{user_id: userId, channel_role:"channel_moderator"}]);
        await channel.inviteMembers(channelMembers);

    
        // The channel's unique ID will be available in channel.cid
        console.log("New channel created with ID:", channel.id);
    
        return {
          id: channel.id,
          name: chatName,
          members: userArray
      };

      } catch (error) {
        console.error("Error creating channel:", error);
        throw error;
      }
}

export const inviteDirectMessage = async (userId, client, channelMember, invitationMessage) => {
  try {

      const temporaryChannel = client.channel('messaging',  uuid.v4(), {
        invitationMessage: invitationMessage,
        isGroupChat: false,
        typeChat: 'chat',
      });
  
      const userArray = [userId]
      const memberArray = [channelMember]
      console.log(channelMember, "channelMember")
    
      await temporaryChannel.create();
      await temporaryChannel.addMembers(userArray);
      await temporaryChannel.inviteMembers(memberArray); 

      const myUserChats = chatClient?.user?.userChats
      myUserChats.push(channelMember)

      const updateMy = {
        id: userId,
        set: {
          userChats: myUserChats,
        },
      };

      await chatClient.partialUpdateUser(updateMy);

  
      const response = await chatClient.queryUsers({ id: channelMember });

      const theirUserChats = response.users[0]?.userChats;
      theirUserChats.push(userId)

 
      const updateOther = {
        id: channelMember,
        set: {
          userChats: theirUserChats,
        },
      };

     
      await chatClient.partialUpdateUser(updateOther);


      // The channel's unique ID will be available in channel.cid
      console.log("New direct channel created");
  
  
    } catch (error) {
      console.error("Error creating channel:", error);
      throw error;
    }
} 


export const createDirectMessage = async (client, channelMembers, nameOtherUser) => {
  try {

      const channel = client.channel('messaging',  uuid.v4(), {
        isGroupChat: false,
        typeChat: 'chat',
      });
  
  
      const userArrays = channelMembers
      console.log(userArrays, "userArrays")


      await channel.create();
      await channel.addMembers(userArrays);

    
      // The channel's unique ID will be available in channel.cid
      console.log("New channel created with ID:", channel.id);
  
      return channel.id;
    } catch (error) {
      console.error("Error creating channel:", error);
      throw error;
    }
}


export const createMessageExpanded = async (client, messageId, channelMembers, text, question, 
  model, modelImage, chatName) => {
  try {

      const channel = client.channel('messaging', messageId, {
        name: "Thread",
        typeChat: 'messageExpanded',
        AIMessages: [{"role": "system", "content": "You are a helpful assistant."},{"role": "user", "content": question},{"role": "assistant", "content": text}] ,
        isMessageConvo: true,
        chatName: chatName
      });
  
      await channel.create();

      await channel.addMembers(channelMembers);


      const messageData = {
        question: question,
        model:  model,
        modelAIPhoto: modelImage,
        text: text,
        isAI: true,
    };
    
      //now add the message to the channel
      await channel.sendMessage(messageData)

  
      // The channel's unique ID will be available in channel.cid
      console.log("New message expanded created with ID:", channel.id);
  
      return channel.id;
    } catch (error) {
      console.error("Error creating message expanded:", error);
      throw error;
    }
}



export const createConvo = async (client, channelMembers, chatId, chatName) => {

    try {
        console.log("before create convo", channelMembers, chatId)
        const convo = client.channel('messaging', uuid.v4(), {
        name: "New Subchannel",
        chatId: chatId,
        typeChat: 'convo',
        //color: color ? color : getRandomColor(),
        AIMessages: [{"role": "system", "content": "You are a helpful assistant."}],
        isMessageConvo: false,
        chatName: chatName ? chatName : ''
      });

      console.log("after create convo", channelMembers, chatId)
      await convo.create();

 
      await convo.addMembers(channelMembers, { text: `${client?.user?.name} created this channel!` });
        
        console.log("error here")
        
        
        // The channel's unique ID will be available in channel.cid
        console.log("New channel created with ID:", convo.id);
    
    return convo.id;
  } catch (error) {
    console.error("Error creating conv in chat actions:", error);
    throw error;
  }
}

export const searchUsers = async (client, queryText) => {
  const searchTerm = queryText;
  // const searchTerm = queryText.toLowerCase();

  try {

      // an array of a user object that matches that id [{id: "123", name: "John"}}]
      const response = await client.queryUsers(
          { id: { $in: [searchTerm] } },
          { limit: 1 }
      );

      if (response.users.length > 0) {
          return response.users;
      } else{
          return [];
      }


  } catch (error) {
      console.log(error);
      return []
  }
}