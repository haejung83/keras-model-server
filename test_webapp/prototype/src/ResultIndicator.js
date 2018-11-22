import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import './ResultIndicator.css';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    margin: theme.spacing.unit,
    width: 300
  }),
});

class ResultIndicator extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props)
    this.state = {
      value: 0
    }
  }

  setResult = (newResult) => {
    this.setState({value: newResult});
  }

  getResult = () => {
    return this.state.value;
  }

  render() {
    return (
      <div>
        <Paper className={this.props.classes.root} elevation={4}>
          <Typography component="p">
            Response Result Indicator
          </Typography>
          <Typography variant="headline" component="h3">
            {this.state.value}
          </Typography>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(ResultIndicator)
