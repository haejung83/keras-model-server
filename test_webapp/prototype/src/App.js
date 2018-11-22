import React, { Component } from 'react';
import './App.css';
import NavBarPlace from './NavBarPlace'
import WebcamIntervalCapture from './WebcamIntervalCapture'
import VideoIntervalCapture from './VideoIntervalCapture';
import AppPreference from './AppPreference';

// Start here
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentViewIndex : 1
    }
  }

  handleViewEvent = (evt) => {
    console.log("handleViewEvent: " + evt);
    if(evt === "webcam")
      this.setState({ currentViewIndex : 0 })
    else if(evt === "video")
      this.setState({ currentViewIndex : 1 })
    else if(evt === "preference")
      this.setState({ currentViewIndex : 2 })

  }

  handleActionEvent = (evt) => {
    console.log("handleActionEvent: " + evt);
  }

  currentMainActionView = () => {
    let v = null;

    switch(this.state.currentViewIndex) {
      case 1:
        v = <VideoIntervalCapture />
      break;
      case 2:
        v = <AppPreference />
      break;
      case 0:
      default:
        v = <WebcamIntervalCapture />
      break;
    }

    return v;
  }

  render() {

    const mainActionView = this.currentMainActionView();

    return (
      <div className="App">
        <NavBarPlace 
          handleViewEvent={this.handleViewEvent} 
          handleActionEvent={this.handleActionEvent}
          />
        {mainActionView}
      </div>
    );
  }
}

export default App
