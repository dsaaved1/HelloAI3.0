import React, {ReactNode} from 'react';
import {ActionSheetIOS, Modal, StyleSheet, View, Animated, Easing, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import {os_ios} from '../utils/os';
import {dw} from '../utils/dimension';
import TouchableOpacityActiveOne from './TouchableOpacityOne';
import {colors} from '../theme'
import UIDivider from './UIDivider';

type Props = {
  visible: boolean;
};

const CustomAlert: React.FC<Props> = ({
  visible,
}) => {

  
  return (
    <View style={{
      //backgroundColor:'rgba(0,0,0,0.7)',
      ...StyleSheet.absoluteFill,
      display:visible?'flex':'none'
    }}>
    <Modal visible={visible} transparent={true} animationType="slide">
      <ContentWrapper>
        <ActionsWrapper>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color={colors.dark.secondaryLight} />
            </View>
        </ActionsWrapper>
      </ContentWrapper>
    </Modal>
    </View>
  );
  // }
};

export default CustomAlert;

const ContentWrapper = styled.View`
  position: absolute;
  height: 100%;
  width: 100%;
  bottom: 0;
  align-items: center;
  justify-content: flex-end;
`;

const ActionsWrapper = styled.View`
  border-radius: 12px;
  overflow: hidden;
`;




