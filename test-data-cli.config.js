// For details about these configs, please check:
// https://github.com/GetStream/stream-chat-test-data-cli/blob/master/config.js.template
module.exports = {
  // ============================================================================
  //          Set your API key and secret here
  // ============================================================================

  apiKey: 'fv5cgz9cy3kb',
  secret: 'he7p3f8yr9kkqc87bz2tpkqzv86znt6qkwtq8ne8sdn655z36cn6b8tpwxdzm238',


  // ============================================================================
  // ============================================================================

  // baseUrl: 'https://chat-us-east-1.stream-io-api.com',
  channelType: 'messaging',
  serverSideUser: 'stevegaliligetstreamio',
  channelIdPrefix: 'whatsapp-clone',

  customProperties: {
    name: '',
  },
  appUsers: [
    {
      id: 'sami',
      name: 'Sam Parker',
      image: 'https://ca.slack-edge.com/T02RM6X6B-U039J798FJ7-894cf1f07326-512',
    },
    {
      id: 'vischal',
      name: 'Vischal Narkhede',
      image: 'https://ca.slack-edge.com/T02RM6X6B-UHGDQJ8A0-dae0b1606590-512',
    },
    {
      id: 'kushal',
      name: 'Kushal Agarwal',
      image: 'https://ca.slack-edge.com/T02RM6X6B-U02DTREQ2KX-636ea4cf258d-512',
    },
    {
      id: 'nick',
      name: 'Nick Johnson',
      image: 'https://ca.slack-edge.com/T02RM6X6B-U02U7SJP4-0f65a5997877-512',
    },
    {
      id: 'recruiter35',
      name: 'Recruiter',
      image: 'https://ca.slack-edge.com/T02RM6X6B-U02DWM9AYSF-gdb04dbb707a-512',
    },
    {
      id: 'santosh',
      name: 'Santosh Vaiyapuri',
      image: 'https://ca.slack-edge.com/T02RM6X6B-U0359AX2TUY-dc7dbec0bb88-512',
    },
    {
      id: 'joe',
      name: 'Joe Jones',
      image: 'https://ca.slack-edge.com/T02RM6X6B-U02RM6X6D-g28a1278a98e-512',
    },
    {
      id: 'moises',
      name: 'Moises Nwagba',
      image: 'https://ca.slack-edge.com/T02RM6X6B-U02VBCJJKUJ-adf6a29f65f3-512',
    },
  ],
  createUsers: true,
  numberOfGroupChannel: 10,
  createOneToOneConversations: true,
  channelNames: [],
  numberOfMessagesPerChannel: 20,
  maxNumberOfAttachmentsPerMessage: 6,
  attachmentFrequency: 10,
  urlFrequency: 7,
  reactionFrequency: 4,
  threadReplyFrequency: 5,
  truncateBeforeAddingNewMessages: true,
  reactions: ['204', '209', '249', '344', '315'],
  urls: [
    'https://www.youtube.com/watch?v=ceGLEhahLKQ',
    'https://reactnative.dev/',
    'https://shorturl.at/hmyKM',
    'https://www.youtube.com/watch?v=3oGLuM_--Uo&t=13s',
    'https://shorturl.at/mBUY7',
    'https://github.com/GetStream/slack-clone-react-native/',
    'https://www.youtube.com/watch?v=tQ7T530Q7aU',
  ],
  language: 'en',
}
