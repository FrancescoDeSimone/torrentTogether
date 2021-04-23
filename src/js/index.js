const client = new WebTorrent()
var timeoutSnackbar = undefined
client.on('error', console.error)

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault()
  const torrentId = document.querySelector('form input[name=torrentId]').value
  log('Adding ' + torrentId)
  startStream(torrentId)
})






document.getElementById('snackbar')
  .addEventListener('click',
    () => snackbar.className = snackbar.className.replace("show", ""));

const log = str => {
  console.log("call")
  const snackbar = document.getElementById("snackbar");
  snackbar.className = "show"
  snackbar.innerText = str
  if (timeoutSnackbar != undefined) clearTimeout(timeoutSnackbar)
  timeoutSnackbar = setTimeout(
      () => snackbar.className = snackbar.className.replace("show", ""), 10000)
}
