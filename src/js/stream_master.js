const startMaster = () => {
  const peer = new Peer(null, {debug : 2})
  peer.on('open', (id) => {
    if (peer.id === null) {
      toast('Received null id from peer open')
      peer.id = lastPeerId
    } else {
      lastPeerId = peer.id
    }
    toast('ID: ' + peer.id + "\nAwaiting connection...")
    document.getElementById("url").innerText =
        window.location.href + "?id=" + encodeURI(peer.id)
  })

  peer.on('connection', function(c) {
    if (conn && conn.open) {
      c.on('open', function() {
        c.send("Already connected to another client")
        setTimeout(function() { c.close() }, 500)
      })
      return
    }
    conn = c
    toast("Connected to: " + conn.peer)
    ready()
  })
  peer.on('disconnected', connectionLost)
  peer.on('close', connectionClose)
  peer.on('error', console.error)
}

const ready = () => {
  conn.on('data', (data) => { console.log("Data recieved", data) })
  conn.on('close', () => {
    toast("Connection reset<br>Awaiting connection...")
    conn = null
  })
}

const sendVideoStatus = () => {
  if (conn && conn.open) {
    VideoStatus.second = video.currentTime
    VideoStatus.paused = video.paused
    VideoStatus.buffering = video.readyState < video.HAVE_FUTURE_DATA
    VideoStatus.downloading = video.networkState === video.NETWORK_LOADING
    msg = VideoStatus
    conn.send(msg)
    console.log("send", msg)
  } else {
    toast('No one connected yet')
  }
}

video.addEventListener('seeking', (event) => {sendVideoStatus()})
video.addEventListener('play', (event) => {sendVideoStatus()})
video.addEventListener('pause', (event) => {sendVideoStatus()})
