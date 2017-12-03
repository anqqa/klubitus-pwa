// @flow
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import type { Theme } from 'material-ui/styles';
import * as React from 'react';

import AppFrame from './AppFrame';


const theme: Theme = createMuiTheme({
  palette: {
    background: {
      appBar:  '#111111',
      default: '#000000',
      paper:   '#222222',
    },
    text: {
      secondary: '#999999',
    },
    type: 'dark'
  },
  typography: {
    //htmlFontSize: 12,  // The actual size is 10px, but it's too big for us
  }
});


export default class AppShell extends React.Component {
  render() {
    const { children } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <AppFrame>{children}</AppFrame>
      </MuiThemeProvider>
    );
  }
}
