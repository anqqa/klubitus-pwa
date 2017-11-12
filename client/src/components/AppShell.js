// @flow
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import type { Theme } from 'material-ui/styles';
import * as React from 'react';

import AppFrame from './AppFrame';


const theme: Theme = createMuiTheme({
  palette: {
    type: 'dark'
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
