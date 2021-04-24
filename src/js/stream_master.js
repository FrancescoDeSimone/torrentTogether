var conn = []
const startMaster =
    () => {
        const peer = new Peer(null, {
            debug: 2
        })
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

        peer.on('connection', (c) => {
            conn.push(c)
            toast("Connected to: " +
                conn.reduce((acc, el) => acc += el.peer + "<\\br>", ""))
            ready()
        })
        peer.on('disconnected', connectionLost)
        peer.on('close', connectionClose)
        peer.on('error', console.error)
    }

const ready =
    () => {
        conn.forEach(
            c => c.on('data', (data) => {
                console.log("Data recieved", data)
            }))
        conn.forEach(c => c.on('close', () => {
            toast("Connection reset\nAwaiting connection...")
            conn = null
        }))
    }

const sendVideoStatus =
    () => {
        if (conn.length == 0)
            toast('No one connected yet')
        else conn.forEach(c => {
            if (c.open) {
                VideoStatus.second = video.currentTime
                VideoStatus.paused = video.paused
                VideoStatus.buffering = video.readyState < video.HAVE_FUTURE_DATA
                VideoStatus.downloading =
                    video.networkState === video.NETWORK_LOADING
                msg = VideoStatus
                c.send(msg)
                console.log("send", msg)
            }
        })
    }

video.addEventListener('seeking', (event) => {
    sendVideoStatus()
})
video.addEventListener('play', (event) => {
    sendVideoStatus()
})
video.addEventListener('pause', (event) => {
    sendVideoStatus()
})