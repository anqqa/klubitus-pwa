// @flow

import Button from 'material-ui/Button';
import type { Theme } from 'material-ui/styles';
import withStyles from 'material-ui/styles/withStyles';
import React from 'react';
import { Link } from 'react-router-dom';
import ChevronLeft from 'react-feather/dist/icons/chevron-left';
import ChevronRight from 'react-feather/dist/icons/chevron-right';


type ProvidedProps = {
  classes: Object;
  theme:   Theme;
}

type Props = {
  next?:         string;
  nextText?:     string;
  previous?:     string;
  previousText?: string;
}

class Pagination extends React.PureComponent<ProvidedProps & Props> {

  render() {
    const { classes, next, nextText = 'Next page', previous, previousText = 'Previous page' } = this.props;

    return (
      <div className={classes.container}>
        <Button component={Link} size="small" to={previous}>
          <ChevronLeft className={classes.iconPrevious} /> {previousText}
        </Button>
        &nbsp; - &nbsp;
        <Button component={Link} size="small" to={next}>
          {nextText} <ChevronRight className={classes.iconNext} />
        </Button>
      </div>
    );
  }

}


const styles = (theme: Theme) => ({

  container: {
    alignItems:     'center',
    color:          theme.palette.text.secondary,
    display:        'flex',
    justifyContent: 'center',
  },

  iconNext: {
    marginLeft: theme.spacing.unit,
  },

  iconPrevious: {
    marginRight: theme.spacing.unit,
  },

});


export default withStyles(styles, { withTheme: true })(Pagination);
