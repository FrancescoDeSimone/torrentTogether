
const startStream = (torrentId) => {
  client.add(torrentId, (torrent) =>{
    const file = torrent.files.find((file) => file.name.endsWith('.mp4'))
    file.renderTo('#output')

  })
}

