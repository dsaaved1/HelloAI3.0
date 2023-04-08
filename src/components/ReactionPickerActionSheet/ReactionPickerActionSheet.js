/* eslint-disable react/display-name */
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useContext } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { SlackAppContext } from '../../contexts/SlackAppContext';
import { useMessageReactions } from '../../hooks/useMessageReactions';
import { BottomSheetBackground } from '../BottomSheetBackground';
import { EmojiList } from './EmojiList';
import {useAppContext} from '../../App'

const snapPoints = [300, 600];

export const ReactionPickerActionSheet = React.forwardRef((_, fRef) => {
  const { activeMessage } = useAppContext();
  const { toggleReaction } = useMessageReactions(activeMessage);

  const toggleReactionAndDismiss = (reactionType) => {
    fRef.current?.dismiss();
    toggleReaction(reactionType);
  };

  const renderBackdrop = useCallback((props) => {
    const opacityStyle = useAnimatedStyle(
      () => ({
        // 896 - max height of bottom sheet
        opacity: (800 - props.animatedPosition.value) / 896,
      }),
      [],
    );

    return (
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: '#000000' },
          opacityStyle,
        ]}>
        <TouchableOpacity
          onPress={() => {
            fRef.current?.dismiss();
          }}
          style={[StyleSheet.absoluteFillObject]}
        />
      </Animated.View>
    );
  }, []);

  return (
    <BottomSheetModal
      backdropComponent={renderBackdrop}
      backgroundComponent={BottomSheetBackground}
      ref={fRef}
      snapPoints={snapPoints}
      stackBehavior={'replace'}>
        <Text>hello</Text>
      <EmojiList toggleReaction={toggleReactionAndDismiss} />
    </BottomSheetModal>
  );
});
