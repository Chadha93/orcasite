import React, { createRef } from "react"

import LikeIcon from "./icons/LikeIcon.js"
import PlayIcon from "./icons/PlayIcon.js"
import ShareIcon from "./icons/ShareIcon"
import DownloadIcon from "./icons/DownloadIcon"

import { Pause } from "@material-ui/icons"

import { Popover } from '@material-ui/core';

import { IconButton } from "@material-ui/core"

import { feedSrc } from "utils/feedStorage"

import MediaStreamer from "components/MediaStreamer"

import Slider from "@material-ui/core/Slider"

import styled from "styled-components"

const Hidden = styled.div`
  display: none;
`

const PlayerDiv = styled.div`
  display: flex;
  align-items: center;
`
const SliderTime = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`

const TimeDisplay = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

class TableEntry extends React.Component {

    handlePlayIconButtonPress = (event) => {
      this.setState({anchorEl: event.currentTarget});
    }

    handlePauseButtonPress = () => {
      this.setState({anchorEl: null});
    }

    setControls = controls => {
      debugger;
      this.setState({ isLoading: false, ...controls })
    }

    formattedSeconds = seconds => {
      const mm = Math.floor(seconds / 60)
      const ss = seconds % 60
      return `${Number(mm)
        .toString()
        .padStart(2, "0")}:${ss.toFixed(0).padStart(2, "0")}`
    }

    constructor(props) {
      super(props);
      this.state = {
        type: this.props.type,
        dateTime: this.props.dateTime,
        anchorEl: null,

        playerTime: 0,
        isPlaying: false,
        isLoading: false,

        playPause: () => {
          if (this.state.isPlaying) {
            this.state.pause();
          } else if (!this.state.isLoading && !this.state.isPlaying) {
            this.state.play();
          } else { // pass

          }
        }
      };

      this.mediaStreamerRef = createRef();
    }

    componentDidMount() {

    }

    render() {
      const open = Boolean(this.state.anchorEl);

      const nodeName = this.props.nodeName;
      const timestamp = this.props.detection.playlistTimestamp;
      const detection = this.props.detection;

      const startOffset  = Math.max(parseFloat(detection.playerOffset) - 5, 0);
      const endOffset = parseFloat(detection.playerOffset) + 5;

      const isPlaying = this.state.isPlaying;

      const duration =  (+endOffset) - (+startOffset);

      return(
          <>
            <div style={{display:"flex", width:"100%", height: "64px", flexDirection: "row", marginBottom:"15px", marginTop:"15px", paddingTop:"8px"}} >
            <div style={{wordWrap: "break-word", width:"25%"}}>{this.state.dateTime}</div>
            <div className="record" style={{display: "flex", flexDirection: "row", backgroundColor: "#E9E9E9", borderRadius:"3px", width:"75%", alignItems: "center", alignContent: "center"}}>             
              <div style={{textAlign:"left", width:"100%"}}>
                  A user heard a {this.state.type}
              </div>
              <div style={{textAlign:"left", width:"100%"}}>
                <PlayerDiv>
                  {!isPlaying && 
                    <IconButton onClick={this.state.playPause /*this.handlePlayIconPress*/} disableRipple={true} style={{color: "rgb(0,0,0,0)", width: '35px', height: '35px', backgroundColor: '#f5f5f5', boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)"}}>
                      <PlayIcon /> 
                    </IconButton>    
                  }
                  {isPlaying && 
                    <>
                      <Pause className="icon" fontSize="large" onClick={this.state.playPause /*this.handlePauseIconPress*/} />
                      <Popover
                        open={open}
                        anchorEl={this.state.anchorEl}
                        onClose={this.handleClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                        }}
                      >
                      <SliderTime>
                        <Slider
                          step={0.1}
                          max={duration}
                          value={this.state.playerTime} 
                          onChange={this.onSliderChange}
                          onChangeCommitted={this.onSliderChangeCommitted}
                        />
                        <TimeDisplay>
                          <div>{this.formattedSeconds(this.state.playerTime.toFixed(0))}</div>
                          <div>{this.formattedSeconds(duration.toFixed(0))}</div>
                        </TimeDisplay>
                      </SliderTime>
                    </Popover>
                    </>
                  }

                  <Hidden>
                    <MediaStreamer
                      src={feedSrc(nodeName, timestamp)}
                      startOffset={startOffset}
                      endOffset={endOffset}
                      onReady={this.setControls}
                      onLoading={() => this.setState({ isLoading: true })}
                      onPlaying={() =>
                        {
                          this.setState({ isLoading: false, isPlaying: true });
                        }
                      }
                      onPaused={() => 
                        {
                          this.setState({ isLoading: false, isPlaying: false })
                        }
                      }
                      onTimeUpdate={playerTime => this.setState({ playerTime })}
                    />
                  </Hidden>
                </PlayerDiv>
                {
                  /*
                  <IconButton onClick={this.playIconButtonClick} disableRipple={true} style={{color: "rgb(0,0,0,0)", width: '35px', height: '35px', backgroundColor: '#f5f5f5', boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)"}}>
                    <PlayIcon />
                  </IconButton>
                  */
                }
                <IconButton onClick={this.thumbUpIconButtonClick} disableRipple={true} style={{color: "rgb(0,0,0,0)", width: '35px', height: '35px', backgroundColor: '#f5f5f5', boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)"}}>
                  <LikeIcon /> 
                </IconButton>      
                <IconButton onClick={this.shareIconButtonClick} disableRipple={true} style={{color: "rgb(0,0,0,0)", width: '35px', height: '35px', backgroundColor: '#f5f5f5', boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)"}}>
                  <ShareIcon /> 
                </IconButton>      
                <IconButton onClick={this.downloadIconButtonClick} disableRipple={true} style={{color: "rgb(0,0,0,0)", width: '35px', height: '35px', backgroundColor: '#f5f5f5', boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)"}}>
                  <DownloadIcon />
                </IconButton>
              </div>
            </div>
          </div>
          </>
        )
    }
}

export default TableEntry