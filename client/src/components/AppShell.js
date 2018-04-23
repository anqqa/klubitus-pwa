// @flow
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as React from 'react';

import AppFrame from './AppFrame';
import theme from './theme';


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
