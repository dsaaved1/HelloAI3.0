import {Platform} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '../colors';

const Title = styled.Text<{
  color?: string;
  weight?: number;
  textDecoration?: string;
  lineHeight?: number;
}>`
  font-weight: ${(props: any) => props.weight || 600};
  text-decoration: ${(props: any) => props.textDecoration || 'none'};

  color: ${(props: any) => (props.color ? props.color : colors.white)};
`;
export const T10 = styled(Title)`
  font-size: 10px;
`;
export const T11 = styled(Title)`
  font-size: 11px;
`;
export const T12 = styled(Title)`
  font-size: 12px;
  text-decoration-color: ${colors.white};
  font-weight: 400;
`;
export const T13 = styled(Title)`
  font-size: 13px;
  text-decoration-color: ${colors.white};
`;
export const T14 = styled(Title)`
  font-size: 14px;
  text-decoration-color: ${colors.white};
  line-height: 23px;
`;

export const T16 = styled(Title)`
  font-size: 16px;
`;

export const T18 = styled(Title)`
  font-size: 18px;
`;

export const T20 = styled(Title)`
  font-size: 20px;
`;

export const T24 = styled(Title)`
  font-size: 24px;
`;
export const T28 = styled(Title)`
  font-size: 28px;
`;

export const T32 = styled(Title)`
  font-size: 32px;
`;
