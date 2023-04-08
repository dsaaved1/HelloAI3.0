import React from 'react';
import { IconProps, RootPath, RootSvg } from 'stream-chat-react-native';

export default (props: IconProps) => (
  <RootSvg {...props} viewBox="0 0 24 24">
    <RootPath
      d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM16.293 15.707L15.707 16.293L12 12.586L8.293 16.293L7.707 15.707L11.414 12L7.707 8.293L8.293 7.707L12 11.414L15.707 7.707L16.293 8.293L12.586 12L16.293 15.707Z"
      {...props}
    />
  </RootSvg>
);