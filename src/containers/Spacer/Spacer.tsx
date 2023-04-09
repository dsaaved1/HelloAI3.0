import React from 'react';

//styled
import styled from 'styled-components/native';

type Props = {
  width?: number;
  height?: number;
};

const Spacer: React.FC<Props> = ({width, height}) => {
  return <Wrapper width={width} height={height} />;
};
export default Spacer;

const Wrapper = styled.View<{
  width?: number;
  height?: number;
}>`
  width: ${(props: any) => props.width | 0}px;
  height: ${(props: any) => props.height | 0}px;
`;
