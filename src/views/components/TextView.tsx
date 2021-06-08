import styled from 'styled-components';
import { Typography } from '@material-ui/core';

type TextViewProps = {
  light?: boolean;
  bold?: boolean;
};
export default styled(Typography)`
  ${(props: TextViewProps) => props.light && 'color:#7c7c7c !important;'}
  ${(props: TextViewProps) => props.bold && 'font-weight:bold !important;'}
`;
