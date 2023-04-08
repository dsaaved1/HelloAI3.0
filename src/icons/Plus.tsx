import React from 'react';
import { IconProps, RootPath, RootSvg } from 'stream-chat-react-native';

export default (props: IconProps) => (
  <RootSvg {...props} viewBox="0 0 24 24">
    <RootPath
      d="M13 11V3.5a.5.5 0 00-1 0V11H3.5a.5.5 0 000 1H12v7.5a.5.5 0 001 0V12h7.5a.5.5 0 000-1H13z"
      {...props}
    />
  </RootSvg>
);