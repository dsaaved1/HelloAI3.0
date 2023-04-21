import 'react-native-url-polyfill/auto';
import React, {useMemo} from 'react'
import {
  useChannelContext,
  useChatContext,
  useMessageInputContext,
  useMessagesContext,
} from 'stream-chat-react-native'
import {StyleSheet, View} from 'react-native'
import {globalStyles, sizes} from '../../global'
import {colors} from '../../theme'
import IconButton from '../IconButton'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import moment from 'moment'
import {MessageResponse} from 'stream-chat'
import {set} from 'lodash'
import {useAppContext} from '../../App'
import keys from '../../assets/constants/keys';

const audioRecorderPlayer = new AudioRecorderPlayer()

type Props = {
  recordingActive: boolean
  pressable: boolean
  recordingDurationInMS: number
  setRecordingActive(isActive: boolean): void
  setRecordingDurationInMS(ms: number): void
}
export default ({
  pressable,
  recordingActive,
  setRecordingActive,
  recordingDurationInMS,
  setRecordingDurationInMS,
}: Props) => {
  const {fileUploads, imageUploads, text, sendMessage} =
    useMessageInputContext()
  const {client} = useChatContext()
  const {updateMessage} = useMessagesContext()
  const {channel} = useChannelContext()
  const {messageInputRef} = useAppContext()

  const isMessageEmpty = useMemo(
    () => !text && !imageUploads.length && !fileUploads.length,
    [text, imageUploads.length, fileUploads.length],
  )

  const sendVoiceMessage = async (uri: string) => {
    const message: MessageResponse = {
      created_at: moment().toString(),
      attachments: [
        {
          asset_url: uri,
          file_size: 200,
          mime_type: 'audio/mp4',
          title: 'test.mp4',
          type: 'voice-message',
          audio_length: moment(recordingDurationInMS).format('m:ss'),
        },
      ],
      mentioned_users: [],
      id: `random-id-${new Date().toTimeString()}`,
      status: 'sending',
      type: 'regular',
      user: client.user,
    }
    updateMessage(message)

    const res = await channel.sendFile(uri, 'test.mp4', 'audio/mp4')
    const {
      created_at,
      html,
      type,
      status,
      user,
      ...messageWithoutReservedFields
    } = message
    set(messageWithoutReservedFields, ['attachments', 0, 'asset_url'], res.file)
    await channel.sendMessage(messageWithoutReservedFields)
  }

  const onStartRecord = async () => {
    messageInputRef.current.focus();
    setRecordingActive(true)
    await audioRecorderPlayer.startRecorder()
    audioRecorderPlayer.addRecordBackListener(e => {
      setRecordingDurationInMS(Math.floor(e.currentPosition))
    })
  }

  const onStopRecord = async () => {
    setRecordingActive(false)

    const result = await audioRecorderPlayer.stopRecorder()
    audioRecorderPlayer.removeRecordBackListener()

    if (recordingDurationInMS < 500) {
      setRecordingDurationInMS(0)
      return null
    }

    setRecordingDurationInMS(0)
    await sendVoiceMessage(result)
    //await sendtranscriptWhispers(result)
  }

  const sendtranscriptWhispers = async (uri: string) => {
    const { Configuration, OpenAIApi } = require('openai')
    const configuration = new Configuration({
      apiKey: keys.ai,
    })
    const openai = new OpenAIApi(configuration)

    console.log("here in ai before response")

    try {
      
      console.log(uri)
      const response = await openai.createTranslation({
          file: uri,
          model: "whisper-1",
      });
        console.log(response, "responseeeeeee")
    } catch (e) {
        console.error("Error asking AI: ", e);
    }

  }

  
    return (
      <View style={styles.micWrap}>
        <IconButton
          usePressable={pressable}
          onPress={() => null}
          onLongPress={onStartRecord}
          onPressOut={onStopRecord}
          iconName={'Mic'}
          pathFill={colors.dark.secondaryLight}
          //pathFill={colors.dark.text}
          width={recordingActive ? sizes.xxxl : sizes.lxl}
          height={recordingActive ? sizes.xxxl : sizes.lxl}
          // style={{
          //   ...styles.mic,
          // }}
        />
      </View>
    )
  
}


const styles = StyleSheet.create({
  micWrap: {
   
  },
})
