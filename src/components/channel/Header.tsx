import React from 'react';
import Row from '../../containers/Row/Row';
import TextButton from '../TextButton';
import {T13, T20} from '../../common/Typography/index';
import {colors} from '../../common/colors/index';
import styled from 'styled-components/native';

type Props = {
  headerTitle?: string;
  backButtonVisible?: boolean;
  onLeftButtonPress?: () => void;
  onRightButtonPress?: () => void;
  editButtonVisible?: boolean;
  leftButtonText?: string;
  rightButtonText?: string;
  showBackIcon?: boolean;
  subText?: string;
  tiltLeft?: boolean;
};

function Header({
  headerTitle,
  backButtonVisible = true,
  editButtonVisible = true,
  onLeftButtonPress,
  onRightButtonPress,
  leftButtonText,
  rightButtonText,
  showBackIcon,
  subText,
  tiltLeft,
}: Props) {
  return (
    <Row rowStyle={{width: '100%'}}>
      {backButtonVisible && (
        <TextButton
          text={leftButtonText}
          onPress={onLeftButtonPress}
          backIcon={showBackIcon}
        />
      )}
      <Wrap>
        <T20
          color={colors.white}
          weight={700}
          style={{marginRight: tiltLeft ? '8%' : 0}}>
          {headerTitle}
        </T20>
        {subText && <T13>{subText}</T13>}
      </Wrap>
      {editButtonVisible && (
        <TextButton text={rightButtonText} onPress={onRightButtonPress} />
      )}
    </Row>
  );
}

export default Header;

const Wrap = styled.View`
  align-items: center;
`;
