import { createMuiTheme } from '@material-ui/core';

import palette from './palette';
import typography from './typography';

// const getProps = (list: any) => {
//   const model: any = {};
//   Object.entries(list).forEach(([k, v]) => {
//     model[k] = v && (<any>v).props;
//   });
//   return model;
// };

const theme = createMuiTheme({
  palette,
  typography,
});

export default theme;
