import React from 'react';
import { IconProps, RootPath, RootSvg } from 'stream-chat-react-native';

export default (props: IconProps) => (
  <RootSvg {...props} viewBox="0 0 24 24">
    <RootPath
      d="M4,6h16c0.552,0,1-0.448,1-1s-0.448-1-1-1H4C3.448,4,3,4.448,3,5S3.448,6,4,6z M20,11H4c-0.552,0-1,0.448-1,1 s0.448,1,1,1h16c0.552,0,1-0.448,1-1S20.552,11,20,11z M20,18H4c-0.552,0-1,0.448-1,1s0.448,1,1,1h16c0.552,0,1-0.448,1-1 S20.552,18,20,18z"
      {...props}
    />
  </RootSvg>
);