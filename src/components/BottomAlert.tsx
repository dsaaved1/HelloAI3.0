import React, {ReactNode} from 'react';
import {ActionSheetIOS, Modal} from 'react-native';
import styled from 'styled-components/native';
import {os_ios} from '../utils/os';
import {dw} from '../utils/dimension';
import TouchableOpacityActiveOne from './TouchableOpacityOne';
import {colors} from '../common/colors/index';
import UIDivider from './UIDivider';

type Props = {
  visible: boolean;
  description?: string;
  disabledButtonIndices?: number[];
  destructiveButtonIndex?: number | number[] | undefined | null;
  textColor?: string;
  actions: {
    text: string;
    onPress: () => void;
    icon?: ReactNode;
  }[];
  withIcon?: boolean;
};

const CustomAlert: React.FC<Props> = ({
  visible,
  description,
  disabledButtonIndices,
  actions,
  destructiveButtonIndex,
  textColor,
  withIcon,
}) => {
  return (
    <Modal visible={visible} transparent={true}>
      <ContentWrapper>
        <ActionsWrapper>
          {description ? (
            <OneButton disabled style={{backgroundColor: colors.black}}>
              <MessageText>{description}</MessageText>
            </OneButton>
          ) : null}
          {actions.slice(1, actions.length).map((action, index) => (
            <OneButton
              key={index}
              onPress={action.onPress}
              style={{
                flexDirection: 'row',
                backgroundColor: colors.black,
                borderTopWidth: index == 0 && !description ? 0 : 1,
                borderTopColor: colors.deepGray,
              }}
              withIcon={withIcon}
              disabled={disabledButtonIndices?.includes(index + 1)}>
              {action?.icon}

              <Text
                destructive={Number(destructiveButtonIndex) - 1 == index}
                disabled={disabledButtonIndices?.includes(index + 1)}
                withIcon={withIcon}
                style={{marginLeft: withIcon ? '5%' : 0}}>
                {action.text}
              </Text>
            </OneButton>
          ))}
        </ActionsWrapper>
        <OneButton borderRadius={true} onPress={actions[0].onPress}>
          <CancelText>{actions[0].text}</CancelText>
        </OneButton>
      </ContentWrapper>
    </Modal>
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
  background-color: rgba(0, 0, 0, 0.7);
  padding-bottom: 10px;
`;

const ActionsWrapper = styled.View`
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const OneButton = styled(TouchableOpacityActiveOne)<{
  borderRadius?: boolean;
  withIcon?: boolean;
}>`
  width: ${dw - 40}px;
  min-height: 56px;
  justify-content: ${props => (props.withIcon ? 'flex-start' : 'center')};
  align-items: center;
  background-color: ${colors.blackShaded};
  border-radius: ${props => (props.borderRadius ? '12px' : 0)};
  padding-vertical: 14px;
  padding-horizontal: 24px;
`;

const Text = styled.Text<{
  destructive?: boolean;
  disabled?: boolean;
  withIcon?: boolean;
}>`
  font-size: 20px;
  font-weight: 400;
  text-align: center;
  color: ${props =>
    props.destructive
      ? colors.redText
      : props.disabled
      ? 'gray'
      : props?.withIcon
      ? colors.white
      : colors.blue};
`;

const MessageText = styled(Text)`
  font-size: 13px;
  color: gray;
  font-weight: 400;
  line-height: 18px;
`;

const CancelText = styled(Text)`
  font-size: 20px;
  font-weight: 600;
`;
