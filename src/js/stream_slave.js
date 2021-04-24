function startSlave(id) {
  peer = new Peer(null, {debug : 2})
  peer.on('open', function(id) {
    if (peer.id === null) {
      toast('Received null id from peer open')
      peer.id = lastPeerId
    } else {
      lastPeerId = peer.id
    }
    toast('ID: ' + peer.id)
  })
  peer.on('connection', function(c) {
    c.on('open', function() {
      c.send("Sender does not accept incoming connections")
      setTimeout(function() { c.close() }, 500)
    })
  })
  peer.on('disconnected', connectionLost)
  peer.on('close', connectionClose)
  peer.on('error', console.error)
  setTimeout(() => join(id),1000)
}

const join = (id) => {
  console.log(id)
  if (conn) {
    conn.close()
  }
  conn = peer.connect(id, {reliable : true})
  conn.on('open', function() {
    console.log("Connected to: " + conn.peer)
  })
  conn.on('data', function(data) {
    console.log(data)
    if(video.readyState != 4) startStream(data.magnet)
    else{
      video.currentTime = data.second
      data.paused? video.pause():video.play()
    }
  })
  conn.on('close', function() { status.innerHTML = "Connection closed" })
}
