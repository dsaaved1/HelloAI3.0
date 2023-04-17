import {StreamChat} from 'stream-chat'
//import {STREAM_API_KEY, STREAM_USER_TOKEN, STREAM_USER_ID} from '@env'
import {ChatContextValue} from 'stream-chat-react-native'

// console.log('env vars loaded:', {
//   STREAM_API_KEY,
//   STREAM_USER_TOKEN,
//   STREAM_USER_ID,
// })
export const chatClient = StreamChat.getInstance(
 'xnspp5s5ggeu'
) as unknown as ChatContextValue['client']
// export const userToken = STREAM_USER_TOKEN
export const user = {
  id: 'boltirisnis',
}

export {}