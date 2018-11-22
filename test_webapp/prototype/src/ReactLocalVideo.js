import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ReactLocalVideo.css'

export default class LocalVideo extends Component {
  static defaultProps = {
    audio: true,
    className: 'LocalVideo',
    height: 480,
    onUserMedia: () => {},
    onUserMediaError: () => {},
    screenshotFormat: 'image/webp',
    width: 640,
  };

  static propTypes = {
    audio: PropTypes.bool,
    onUserMedia: PropTypes.func,
    onUserMediaError: PropTypes.func,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    screenshotFormat: PropTypes.oneOf([
      'image/webp',
      'image/png',
      'image/jpeg',
    ]),
    style: PropTypes.object,
    className: PropTypes.string,
  };

  static mountedInstances = [];

  static userMediaRequested = false;

  constructor() {
    super();
    this.state = {
      isSelectedMedia: false,
      selectedFile: null,
      seekingCallback: null,
    };
  }

  componentDidMount() {
    LocalVideo.mountedInstances.push(this);

    if(this.state.isSelectedMedia) {
        this.handleUserMedia(false, this.state.selectedFile);
    }
  }

  componentWillUnmount() {
    const index = LocalVideo.mountedInstances.indexOf(this);
    LocalVideo.mountedInstances.splice(index, 1);

    if (LocalVideo.mountedInstances.length === 0 && this.state.hasUserMedia) {
      if (this.stream.stop) {
        this.stream.stop();
      } else {
        if (this.stream.getVideoTracks) {
          this.stream.getVideoTracks().map(track => track.stop());
        }
        if (this.stream.getAudioTracks) {
          this.stream.getAudioTracks().map(track => track.stop());
        }
      }
      LocalVideo.userMediaRequested = false;
      window.URL.revokeObjectURL(this.state.src);
    }
  }

  getScreenshot() {
    if (!this.state.hasUserMedia) return null;

    const canvas = this.getCanvas();
    return canvas && canvas.toDataURL(this.props.screenshotFormat);
  }

  getCanvas() {
    if (!this.state.hasUserMedia || !this.video.videoHeight) return null;

    if (!this.ctx) {
      const canvas = document.createElement('canvas');
      const aspectRatio = this.video.videoWidth / this.video.videoHeight;

      canvas.width = this.video.clientWidth;
      canvas.height = this.video.clientWidth / aspectRatio;

      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
    }

    const { ctx, canvas } = this;
    ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);

    return canvas;
  }

  seekToMills(targetMills, callback) {
    const calculatedTime = targetMills / 1000.0;
    this.video.currentTime = calculatedTime;

    if(callback)
      this.setState({ seekingCallback : callback });      
  }

  play = () => {
    if(this.state.hasUserMedia) {
      this.video.play();
    }
  }

  pause = () => {
    if(this.state.hasUserMedia) {
      this.video.stop();
    }
  }

  handleVideoEvents = (evt) => {
      this.props.onUserMedia(evt.type);
      if(evt.type === "seeked" && this.state.seekingCallback != null) {
        this.state.seekingCallback();
        this.setState({ seekingCallback : null });
      }
  }

  handleVideoSelected = () => {
    let selectedFile = this.input.files[0];
    this.handleUserMedia(false, selectedFile);
  }

  handleUserMedia(error, stream) {
    if (error) {
      this.setState({
        hasUserMedia: false,
      });
      this.props.onUserMediaError(error);

      return;
    }
    try {
      const src = window.URL.createObjectURL(stream);

      this.stream = stream;
      this.setState({
        hasUserMedia: true,
        src,
      });
    } catch (err) {
      this.stream = stream;
      this.video.srcObject = stream;
      this.setState({
        hasUserMedia: true,
      });
    }

    this.props.onUserMedia("loaded");
  }

  render() {
    return (
      <div>
        <video
            controls
            onPlay={this.handleVideoEvents}
            onEnded={this.handleVideoEvents}
            onPause={this.handleVideoEvents}
            onCanPlay={this.handleVideoEvents}
            onSeeked={this.handleVideoEvents}
            width={this.props.width}
            height={this.props.height}
            src={this.state.src}
            muted={this.props.audio}
            className={this.props.className}
            playsInline
            style={this.props.style}
            ref={(ref) => {
              this.video = ref;
            }} 
        />
        <div>
          Video file:
          <input 
              type="file"
              accept="video/*"
              onChange={() => this.handleVideoSelected()}
              ref={(ref) => {this.input = ref}}
          />
        </div>
      </div>
    );
  }
}