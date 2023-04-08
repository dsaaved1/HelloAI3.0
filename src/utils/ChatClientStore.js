import { STREAM_API_KEY } from 'react-native-dotenv';
import { StreamChat } from 'stream-chat';
//POSSIBLE ERROR
export const ChatClientStore = {
  get client() {
    return StreamChat.getInstance(STREAM_API_KEY, {
      timeout: 10000,
    });
  },
};
