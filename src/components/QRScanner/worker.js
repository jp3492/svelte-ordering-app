import jsQR from 'jsQr';

self.addEventListener('message', function (e) {
  var decoded = jsQR(
    e.data.data,
    e.data.width,
    e.data.height
  )
  if (decoded) {
    postMessage(decoded.data)
  } else {
    postMessage(null)
  }
});