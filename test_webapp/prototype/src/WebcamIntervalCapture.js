import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'

import Webcam from 'react-webcam';
import axios from 'axios'
import './WebcamIntervalCapture.css';
import ResultIndicator from './ResultIndicator'
import { PREFERENCE_KEYS } from './AppPreference'


const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});


class WebcamIntervalCapture extends React.Component {
  static propTypes = {
      classes: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props)
    this.state = {
      interval: localStorage.getItem(PREFERENCE_KEYS[0]),
      captureInterval: null,
      isStarted: false
    }
  }

  setWebCamRef = (webcam) => {
    this.webcam = webcam;
  }

  setResultIndicatorRef = (resultIndicator) => {
    this.resultIndicator = resultIndicator;
  }

  captureAndPredict = () => {
    // Predict with gathered image from Webcam
    const imageSrc = this.webcam.getScreenshot();
    // console.log('Predict' + imageSrc);

    axios.post('http://localhost:5000/predict/', imageSrc)
    .then((response) => { 
      console.log(response);
      this.resultIndicator.setResult(response.data);
     })
    .catch((error) => { console.log('error: ' + error); })
  };

  start = () => {
    if(!this.state.isStarted) {
        console.log("Start with : " + this.state.interval);
        this.setState({ 
            captureInterval : setInterval(() => this.captureAndPredict(),
            this.state.interval)});
        this.setState({ isStarted : true});
    }
  }

  stop = () => {
    if(this.state.isStarted) {
      clearInterval(this.state.captureInterval);
      this.setState({ isStarted : false});
    }
  }

  render() {
    return (
      <div>

        <Webcam
          className="WebCam-body"
          audio={false}
          height={350*0.75}
          width={350}
          ref={this.setWebCamRef}
          screenshotFormat="image/jpeg"
        />

        <ResultIndicator
          innerRef={this.setResultIndicatorRef}/>

        <Button 
          className={this.props.classes.button}
          variant='raised'
          color="primary"
          disabled={this.state.isStarted}
          onClick={this.start} >Recognition start</Button>
        <Button
          className={this.props.classes.button}
          variant='raised'
          color="primary"
          disabled={!this.state.isStarted}
          onClick={this.stop} >Recognition stop</Button>

      </div>

    );
  }
}

export default withStyles(styles)(WebcamIntervalCapture)
