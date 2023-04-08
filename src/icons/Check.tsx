import React from 'react';
import { IconProps, RootPath, RootSvg } from 'stream-chat-react-native';

export default (props: IconProps) => (
  <RootSvg {...props} viewBox="0 0 24 24">
    <RootPath
      d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM10 16.414L5.293 11.707L6.707 10.293L10 13.586L17.293 6.293L18.707 7.707L10 16.414Z"
      {...props}
    />
  </RootSvg>
);