import React, {Component} from 'react'

import 'videojs-flash'
import 'videojs-contrib-hls'
import videojs from 'video.js'


export default class MediaStreamer extends Component {
  componentDidMount() {
    this.player = videojs(this.videoNode, {
      hls: {
        liveSyncDurationCount: 12 // segments
      }
    })

    this.player.ready(() => {
      this.props.onReady(this.controls)
      this.player.play()
    })

    this.player.on('playing', (e) => {
      this.props.onPlaying()
    })

    this.player.on('pause', () => {
      this.props.onPaused()
    })

    this.player.on('waiting', () => {
      this.props.onLoading()
    })


  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }

  play = () => {
    this.player.play()
  }

  pause = () => {
    this.player.pause()
  }

  playPause = () => {
    this.player.paused() ? this.play() : this.pause()
  }

  controls = {play: this.play, pause: this.pause, playPause: this.playPause}

  render() {
    const { src } = this.props

    return (
      <video ref={node => (this.videoNode = node)} className="video-js" >
        <source src={src} type="application/x-mpegURL" />
      </video>
    )
  }
}
