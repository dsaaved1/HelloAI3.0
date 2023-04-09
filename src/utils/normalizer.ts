import {Dimensions, PixelRatio} from 'react-native';

const {width, height} = Dimensions.get('screen');

const dpToPx = (size: number) => PixelRatio.getPixelSizeForLayoutSize(size);
const ptToPx = (size: number) => PixelRatio.getPixelSizeForLayoutSize(size);

const vw = 392.72727272727275;
const vh = 807.2727272727273;

const scaleWithWidth = (size: number) => size * (width / vw);
const scaleWithHeight = (size: number) => size * (height / vh);

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  dpToPx,
  ptToPx,
  scaleWithWidth,
  scaleWithHeight,
};
