// @flow

import type { Theme } from 'material-ui/styles/index';
import withStyles from 'material-ui/styles/withStyles';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { services } from '../store';


type ProvidedProps = {
  classes: Object;
  match:   Object;
}

type ConnectedProps = {
  user: Object;
}

class Profile extends React.PureComponent<ProvidedProps & ConnectedProps> {

  componentWillMount() {
    const { match } = this.props;

    services.users.find({
      query: {
        $limit:   1,
        username: match.params.username,
      },
    });
  }


  render() {
    return (
      <div>
        profiili
      </div>
    );
  }

}


// Styles
const styles = (theme: Theme) => ({

});


// Redux
const mapStateToProps = state => ({
  users: state.users,
});


export default compose(
  withStyles(styles, { withTheme: true}),
  connect(mapStateToProps),
)(Profile);
