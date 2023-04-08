import React, {ReactNode} from 'react';
import styled from 'styled-components/native';
import {Image, Pressable, View, ViewStyle} from 'react-native';
import {T18, T14, T12} from '../common/Typography/index';
import {colors} from '../common/colors/index';
import Row from '../containers/Row/Row';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ImageSource} from 'react-native-vector-icons/Icon';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Spacer from '../containers/Spacer/Spacer';
import UIDivider from './UIDivider';

type Props = {
  style?: ViewStyle;
  onPress?: () => void;
  icon?: ReactNode;
  iconBackgroundColor?: string;
  iconColor?: string;
  mainText?: string;
  rightIconText?: string | number;
  rightIcon?: boolean;
  isContact?: boolean;
  plainText?: boolean;
  onPlainTextPress?: () => void;
  plaintextColor?: string;
  subText?: string;
  contactProfile?: ImageSource;
  plainTextWithNextIcon?: boolean;
  fromSettings?: boolean;
  plainTextWithLeftLinkIcon?: boolean;
  leftIcon?: boolean;
  leftIconLink?: boolean;
};

function MenuItem({
  style,
  onPress,
  icon,
  iconBackgroundColor,
  iconColor,
  isContact,
  mainText,
  rightIcon = true,
  rightIconText,
  plainText,
  onPlainTextPress,
  plaintextColor,
  subText,
  contactProfile,
  plainTextWithNextIcon,
  fromSettings,
  plainTextWithLeftLinkIcon,
  leftIcon,
  leftIconLink,
}: Props) {
  return (
    <Wrapper onPress={onPress}>
      {plainText ? (
        <PlainTextPressableWrap
          onPress={onPlainTextPress}
          withNextIcon={plainTextWithNextIcon}>
          {leftIcon && (
            <>
              <View
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                  backgroundColor: colors.deepGray,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <AntDesign
                  name={leftIconLink ? 'link' : 'plus'}
                  color={colors.darkblue}
                  size={25}
                  style={{
                    transform: [{rotate: leftIconLink ? '45deg' : '0deg'}],
                  }}
                />
              </View>
              <Spacer width={10} />
            </>
          )}
          {plainTextWithLeftLinkIcon && (
            <>
              <Entypo
                name="link"
                color={colors.darkblue}
                size={20}
                style={{transform: [{rotate: '45deg'}]}}
              />
              <Spacer width={10} />
            </>
          )}
          <T18 color={plaintextColor || colors.blue}>{mainText}</T18>

          {plainTextWithNextIcon && (
            <MaterialIcons
              name="chevron-right"
              size={20}
              color={colors.white}
              style={{marginTop: 3}}
            />
          )}
        </PlainTextPressableWrap>
      ) : (
        <ItemsWrapper style={style}>
          <Row
            rowStyle={{
              justifyContent: 'flex-start',
              flex: isContact ? 0.9 : 0.8,
            }}>
            <IconWrapper
              backgroundColor={iconBackgroundColor}
              style={{
                borderRadius: isContact ? 50 : 5,
                height: isContact ? 50 : 30,
                width: isContact ? 50 : 30,
              }}>
              {isContact ? (
                <Image
                  source={contactProfile}
                  style={{height: '100%', width: '100%'}}
                  resizeMode="cover"
                />
              ) : (
                icon
              )}
            </IconWrapper>
            <MainANsSubTextWrap>
              <T18 numberOfLines={1}>{mainText}</T18>
              {subText && (
                <T12
                  numberOfLines={2}
                  color={'lightgray'}
                  style={{textAlign: 'left'}}>
                  {subText}
                </T12>
              )}
            </MainANsSubTextWrap>
          </Row>
          {fromSettings ? (
            <QrIconWrapper>
              <FontAwesome name="qrcode" size={20} color={colors.blue} />
            </QrIconWrapper>
          ) : (
            <RightIconAndTextWrapper>
              <T14 style={{marginLeft: 'auto'}}>{rightIconText}</T14>
              {rightIcon && (
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color={colors.white}
                  style={{marginTop: 3}}
                />
              )}
            </RightIconAndTextWrapper>
          )}
        </ItemsWrapper>
      )}
    </Wrapper>
  );
}

export default MenuItem;

const Wrapper = styled.TouchableOpacity`
  width: 100%;
  padding: 2.5% 5%;
`;

const IconWrapper = styled.View<{backgroundColor?: string}>`
  height: 30px;
  width: 30px;
  border-radius: 5px;
  background-color: ${props => props.backgroundColor};
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ItemsWrapper = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const RightIconAndTextWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 0.2;
`;

const MainANsSubTextWrap = styled.View`
  margin-left: 4%;
  width: 75%;
`;

const PlainTextPressableWrap = styled.Pressable<{withNextIcon?: boolean}>`
  flex-direction: row;
  width: 100%;
  justify-content: ${props =>
    props.withNextIcon ? 'space-between' : 'flex-start'};
  align-items: center;
`;

const QrIconWrapper = styled.View`
  height: 40px;
  width: 40px;
  border-radius: 20px;
  background-color: ${colors.background};
  align-items: center;
  justify-content: center;
`;