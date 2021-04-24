const client = new WebTorrent()
const urlParams = new URLSearchParams(window.location.search)
const video = document.getElementById("output")
client.on('error', console.error)

VideoStatus = {
    magnet: null,
    second: null,
    paused: null,
    buffering: null,
    downloading: null
}

window.onload =
    () => {
        urlParams.get("id") == null ? master() : slave()
    }

const master = () => {
    document.getElementsByTagName("form")[0].style.display = "block"
}

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()
    const torrentId = document.querySelector('form input[name=torrentId]').value
    VideoStatus.magnet = torrentId
    toast('Adding ' + torrentId)
    startStream(torrentId)
    loadScript("src/js/stream_master.js", () =>
        startMaster())
})

const startStream =
    (torrentId) => {
        client.add(torrentId, (torrent) => {
            const file = torrent.files.find((file) => file.name.endsWith('.mp4'))
            file.renderTo('#output')
        })
    }

const slave =
    () => {
        toast("Connected to id " + urlParams.get("id"))
        loadScript("src/js/stream_slave.js",
            () => startSlave(decodeURI(urlParams.get("id"))))
    }

const connectionLost =
    () => {
        toast('Connection lost. Please reconnect')
        peer.id = lastPeerId
        peer._lastServerId = lastPeerId
        peer.reconnect()
    }

const connectionClose =
    () => {
        conn = null
        toast('Connection destroyed')
    }

const loadScript = (url, callback) => {
    const script = document.createElement("script")
    script.type = "text/javascript"
    if (script.readyState) {
        script.onreadystatechange = () => {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null
                callback()
            }
        }
    } else { // Others
        script.onload = () => {
            callback()
        }
    }

    script.src = url
    document.getElementsByTagName("head")[0].appendChild(script)
}