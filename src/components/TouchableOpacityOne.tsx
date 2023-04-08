import React from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';

const TouchableOpacityActiveOne: React.FC<TouchableOpacityProps> = props => {
  const {children, ...propsOthers} = props;
  // console.log(props)
  return (
    <TouchableOpacity activeOpacity={0.7} {...propsOthers}>
      {children}
    </TouchableOpacity>
  );
};

export default TouchableOpacityActiveOne;
