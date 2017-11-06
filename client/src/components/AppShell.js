// @flow
import * as React from 'react';
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import { AppBar, Toolbar, Typography } from 'material-ui';


const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});


type Props = {
  children: React.Node;
  title:    string;
}

class AppShell extends React.Component<Props> {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <AppBar position="static">
            <Toolbar>
              <Typography type="title">
                klubitus
              </Typography>
            </Toolbar>
          </AppBar>

          <div id="content">
            {React.cloneElement(this.props.children)}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default AppShell;
