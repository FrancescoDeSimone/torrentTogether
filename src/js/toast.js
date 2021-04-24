var timeoutSnackbar = undefined
const toast = str => {
  const snackbar = document.getElementById("snackbar");
  snackbar.className = "show"
  snackbar.innerText = str
  if (timeoutSnackbar != undefined) clearTimeout(timeoutSnackbar)
  timeoutSnackbar = setTimeout(
      () => snackbar.className = snackbar.className.replace("show", ""), 10000)
}

document.getElementById('snackbar')
  .addEventListener('click',
    () => snackbar.className = snackbar.className.replace("show", ""));
