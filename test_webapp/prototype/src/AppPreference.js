import React from 'react';
import {
    Button,
    FormGroup,
    ControlLabel, 
    FormControl,
    HelpBlock
    } from 'react-bootstrap';
import './AppPreference.css';

export const PREFERENCE_KEYS = ["webcam_interval", "video_interval"];

class AppPreference extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.makeInitLocalStorage();
        this.state = {
            webcam_interval : localStorage.getItem(PREFERENCE_KEYS[0]),
            video_interval : localStorage.getItem(PREFERENCE_KEYS[1]),
            isChanged: false
        }
    }

    makeInitLocalStorage = () => {
        var webcam_interval = localStorage.getItem(PREFERENCE_KEYS[0]);
        if(webcam_interval == null)
            localStorage.setItem(PREFERENCE_KEYS[0], 1000);

        var video_interval = localStorage.getItem(PREFERENCE_KEYS[1]);
        if(video_interval == null)
            localStorage.setItem(PREFERENCE_KEYS[1], 1000);
    }

    handleChange = (type, e) => {
        if(type === "webcam")
            this.setState({webcam_interval: e.target.value});
        else if(type === "video")
            this.setState({video_interval: e.target.value});
        
        this.setState({isChanged : true})
    }

    save = () => {
        console.log("save");
        localStorage.setItem(PREFERENCE_KEYS[0], this.state.webcam_interval);
        localStorage.setItem(PREFERENCE_KEYS[1], this.state.video_interval);
        this.setState({isChanged : false})
    }

    render() {
        return (
            <form>
                <FormGroup
                    controlId="webcam_interval">
                    <ControlLabel>WebCam Capture Interval (ms)</ControlLabel>
                    <FormControl
                        type="number"
                        value={this.state.webcam_interval}
                        placeholder="Enter interval"
                        onChange={e => this.handleChange("webcam", e)}/>
                    <FormControl.Feedback />
                    <HelpBlock>An interval value of prediction on WebCam device</HelpBlock>
                </FormGroup>
                <FormGroup
                    controlId="video_interval">
                    <ControlLabel>Video Capture Interval (ms)</ControlLabel>
                    <FormControl
                        type="number"
                        value={this.state.video_interval}
                        placeholder="Enter interval"
                        onChange={e => this.handleChange("video", e)}/>
                    <FormControl.Feedback />
                    <HelpBlock>An interval value of prediction on loaded video</HelpBlock>
                </FormGroup>
                <Button 
                    bsStyle="primary"
                    disabled={!this.state.isChanged}
                    onClick={this.save} >Save</Button>
            </form>
        );
    }
}

export default AppPreference
