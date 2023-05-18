import type {DeepPartial, Theme} from 'stream-chat-react-native'
import {vw} from 'stream-chat-react-native'
import {sizes} from './global'

export const colors = {
  dark: {
    primary: '#2c5588',
    primaryLight: '#3777f0',
    primaryTransparent: '#859299',
    primaryDark: '#222b34',
    //secondary: '#222b34',
    secondary: '#1C2337',
    secondaryLight: '#859299',
    text: '#dce7eb',
    background: '#0E1528',
    highlighted: '#222b34',
    transparentPrimary: 'rgba(255,255,255,0.5)',
    //primaryLightTransparent: 'rgba(3,91,73,0.6)',
    primaryLightTransparent: 'rgba(28, 35, 49, 0.5)',
    border: '#323b40',
    danger: '#D3514CFF',
    active: '#52b9e3',
  },
}

export const theme: DeepPartial<Theme> = {
  colors: {
    targetedMessageBackground: 'transparent',
    grey_dark: 'black',
  },
  imageGallery: {
    backgroundColor: colors.dark.background,
    slide: {
      backgroundColor: colors.dark.background,
    },
    grid: {
      contentContainer: {
        backgroundColor: colors.dark.background,
      },
      handle: {
        backgroundColor: colors.dark.background,
      },
      handleText: {
        color: colors.dark.secondaryLight,
      },
    },
    header: {
      container: {
        backgroundColor: colors.dark.secondary,
      },
      usernameText: {
        color: colors.dark.secondaryLight,
      },
      dateText: {
        color: colors.dark.secondaryLight,
      },
    },
    footer: {
      container: {
        backgroundColor: colors.dark.secondary,
      },
      imageCountText: {
        color: colors.dark.secondaryLight,
      },
    },
  },
  channelListMessenger: {
    flatList: {
      backgroundColor: colors.dark.background,
    },
    flatListContent: {
      backgroundColor: colors.dark.background,
    },
  },
  loadingIndicator: {
    container: {
      backgroundColor: colors.dark.secondaryLight,
    },
  },
  channelListFooterLoadingIndicator: {
    container: {
      backgroundColor: colors.dark.background,
    },
  },
  channelListLoadingIndicator: {
    container: {
      backgroundColor: colors.dark.background,
    },
  },
  channelListSkeleton: {
    background: {backgroundColor: colors.dark.secondaryLight},
    maskFillColor: colors.dark.background,
  },
  channelPreview: {
    title: {
      color: colors.dark.text,
      fontSize: 18,
    },
    message: {
      color: colors.dark.secondaryLight,
      fontSize: 14,
    },
  },
  messageList: {
    scrollToBottomButton: {
      chevronColor: colors.dark.text,
      container: {
        backgroundColor: colors.dark.secondary,
      },
    },
    container: {
      backgroundColor: 'transparent',
    },
    inlineUnreadIndicator: {container: {backgroundColor: colors.dark.secondary}},
  },
  messageInput: {
    container: {
      flex: 1,
      padding: 0,
      borderWidth: 0,
      backgroundColor: 'transparent',
      marginHorizontal: -24, //todo: 5. replace this ugly hack
    },
    inputBox: {
      flex: 1,
      //inputContainer color text
      color: '#7A7A7A',
    },
    inputBoxContainer: {
      borderWidth: 0,
      padding: 0,
    },
  },
  messageSimple: {
    file: {
      container: {
        backgroundColor: '#232B48'
        //backgroundColor: colors.dark.highlighted,
      },
      fileSize: {color: colors.dark.primaryTransparent},
      title: {color: colors.dark.text, fontWeight: 'normal'},
    },
    pinnedHeader: {container: {display: 'none'}},
    content: {
      textContainer: {
        maxWidth: vw(80),
        paddingHorizontal: sizes.ml,
      },
      replyBorder: {
        borderColor: 'transparent',
      },
      containerInner: {
        // backgroundColor: '#232B48',
        // borderColor: '#232B48',
        backgroundColor: colors.dark.secondary,
        borderColor: colors.dark.secondary,
        alignItems: 'stretch',
      },
      deletedMetaText: {
        display: 'none',
      },
      deletedContainerInner: {
        backgroundColor: colors.dark.secondary,
        borderColor: colors.dark.secondary,
      },
      deletedText: {
        text: {
          color: colors.dark.secondaryLight,
        },
      },
      markdown: {
        em: {
          color: colors.dark.secondaryLight,
        },
        text: {
          color: colors.dark.text,
        },
      },
    },
    gallery: {
      galleryContainer: {
        margin: sizes.s,
        borderRadius: sizes.l,
      },
    },
    giphy: {
      container: {
        margin: sizes.s,
        borderRadius: sizes.l,
      },
    },
    card: {
      container: {
        width: vw(80),
      },
      authorNameContainer: {
        display: 'none',
      },
      cover: {
        marginHorizontal: 0,
        borderRadius: 12,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      },
      footer: {
        backgroundColor: colors.dark.primaryDark,
        borderBottomLeftRadius: sizes.s,
        borderBottomRightRadius: sizes.s,
        padding: sizes.m,
        title: {
          marginHorizontal: sizes.s,
          marginBottom: sizes.s,
          color: colors.dark.text,
        },
        description: {
          marginHorizontal: sizes.s,
          color: colors.dark.text,
        },
      },
    },
    replies: {
      container: {
        backgroundColor: colors.dark.secondary,
        borderRadius: sizes.l,
      },
      leftCurve: {
        borderColor: 'transparent',
      },
      messageRepliesText: {
        padding: 4,
      },
      rightCurve: {
        borderColor: 'transparent',
      },
    },
    status: {
      timeIcon: {
        pathFill: colors.dark.primaryTransparent,
      },
      readByCount: {
        display: 'none',
      },
      checkAllIcon: {
        pathFill: colors.dark.primaryTransparent,
      },
      checkIcon: {
        pathFill: colors.dark.primaryTransparent,
      },
    },
  },
}

export const myMessageTheme: DeepPartial<Theme> = {
  messageSimple: {
    file: {
      container: {
        backgroundColor: colors.dark.primaryDark,
        //backgroundColor: 'grey',
      },
    },
    content: {
      replyBorder: {
        borderColor: 'transparent',
      },
      containerInner: {
        backgroundColor: colors.dark.primary,
        borderWidth: 0,
      },
      deletedContainerInner: {
        backgroundColor: colors.dark.primary,
        borderWidth: 0,
      },
    },
    replies: {
      container: {
        backgroundColor: colors.dark.primary,
      },
    },
  },
}
