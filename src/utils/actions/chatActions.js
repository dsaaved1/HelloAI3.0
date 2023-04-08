import uuid from 'react-native-uuid';


function getRandomColor() {
    const colors = ['#6653FF', '#53FF66', '#FF6653', '#BC53FF', '#19C37D', '#FFFF66', '#3F22EC', '#FF6EFF', '#FF9933'];
    return colors[Math.floor(Math.random() * colors.length)];
}


export const createGroupChat = async (userId, client, chatName, channelMembers, isGroupChat) => {
    try {

        const channel = client.channel('messaging',  uuid.v4(), {
          isGroupChat: isGroupChat,
          name: chatName,
          typeChat: 'chat',
        });
    
        const userArray = [userId]

        await channel.create();
        await channel.addMembers(userArray);

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
        temporary: true,
        isGroupChat: false,
        typeChat: 'chat',
      });
  
      const userArray = [userId]
      const memberArray = [channelMember]
      console.log(channelMember, "channelMember")
      await temporaryChannel.create();
      await temporaryChannel.addMembers(userArray);
      await temporaryChannel.inviteMembers(memberArray); 
  
      // The channel's unique ID will be available in channel.cid
      console.log("New temporary channel created");
  
  
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
        name: nameOtherUser,
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
  model, modelImage, className, chatName) => {
  try {

      const channel = client.channel('messaging', messageId, {
        name: chatName? chatName : "Thread",
        typeChat: 'messageExpanded',
        AIMessages: [{"role": "system", "content": "You are a helpful assistant."},{"role": "user", "content": text},{"role": "assistant", "content": question}] ,
        isMessageConvo: true,
      });
  
      await channel.create();

      await channel.addMembers(channelMembers);


      const messageData = {
        question: question,
        model:  model,
        modelAIPhoto: modelImage,
        text: text,
        class: className,
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
        name: "New Project",
        chatId: chatId,
        typeChat: 'convo',
        chatName: chatName,
        //color: color ? color : getRandomColor(),
        AIMessages: [{"role": "system", "content": "You are a helpful assistant."}],
        isMessageConvo: false
      });

      console.log("after create convo", channelMembers, chatId)
        await convo.create();

        console.log("before add members")
        await convo.addMembers(channelMembers);
        
        
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