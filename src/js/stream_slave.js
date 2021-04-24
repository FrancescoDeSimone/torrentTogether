var conn = null
const startSlave =
    (id) => {
        peer = new Peer(null, {
            debug: 2
        })
        peer.on('open', (id) => {
            if (peer.id === null) {
                toast('Received null id from peer open')
                peer.id = lastPeerId
            } else {
                lastPeerId = peer.id
            }
            toast('ID: ' + peer.id)
        })
        peer.on('connection', (c) => {
            c.on('open', () => {
                c.send("Sender does not accept incoming connections")
                setTimeout(() => {
                    c.close()
                }, 500)
            })
        })
        peer.on('disconnected', connectionLost)
        peer.on('close', connectionClose)
        peer.on('error', console.error)
        document.getElementById("url").innerText =
                window.location.href
        setTimeout(() => join(id), 1000)
    }

const connectionClose =
    () => {
        conn = null
        toast('Connection destroyed')
    }

const join = (id) => {
    console.log(id)
    if (conn) {
        conn.close()
    }
    conn = peer.connect(id, {
        reliable: true
    })
    conn.on('open', () => {
        console.log("Connected to: " + conn.peer)
    })
    conn.on('data', (data) => {
        console.log(data)
        if (video.readyState == 0 && client.torrents.length == 0)
            startStream(data.magnet)
        else {
            video.currentTime = data.second
            data.paused ? video.pause() : video.play()
        }
    })
    conn.on('close', () => toast("Connection closed"))
}
