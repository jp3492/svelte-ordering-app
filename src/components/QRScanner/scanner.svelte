<script>
  import jsQR from "jsqr";
  import {
    onMount,
    afterUpdate,
    onDestroy,
    createEventDispatcher
  } from "svelte";

  import { getMenu } from "../../stores/menus";

  const dispatch = createEventDispatcher();

  let video;
  let canvasElement;
  let canvas;

  let streamRef;

  afterUpdate(() => {
    video = document.createElement("video");
    canvasElement = document.getElementById("canvas");
    canvas = canvasElement.getContext("2d");
  });

  onMount(() => {
    video = document.createElement("video");
    canvasElement = document.getElementById("canvas");
    canvas = canvasElement.getContext("2d");

    if (navigator) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then(function(stream) {
          streamRef = stream;
          video.srcObject = stream;
          video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
          video.play();
          requestAnimationFrame(tick);
        });
    }
  });

  onDestroy(() => {
    // gotta make clean up and shut down everything
    // Not sure if this is enough
    if (streamRef) {
      streamRef.getTracks()[0].stop();
    }
  });

  const drawLine = (begin, end, color) => {
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
  };

  // Use facingMode: environment to attemt to get the front camera on phones

  const tick = async () => {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvasElement.hidden = false;

      canvasElement.height = video.videoHeight;
      canvasElement.width = video.videoWidth;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
      var imageData = canvas.getImageData(
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      var code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert"
      });
      if (code) {
        drawLine(
          code.location.topLeftCorner,
          code.location.topRightCorner,
          "#000000"
        );
        drawLine(
          code.location.topRightCorner,
          code.location.bottomRightCorner,
          "#000000"
        );
        drawLine(
          code.location.bottomRightCorner,
          code.location.bottomLeftCorner,
          "#000000"
        );
        drawLine(
          code.location.bottomLeftCorner,
          code.location.topLeftCorner,
          "#000000"
        );
        console.log("CODE DETECTED", code.data);
        if (code.data.match(/^[0-9a-fA-F]{24}$/)) {
          console.log("IS ID");
          dispatch("success", code.data);
        } else {
          console.log("IS NO ID");
        }
      }
    }
    requestAnimationFrame(tick);
  };
</script>

<style>
  div {
    position: relative;
    display: grid;
    place-items: center;
    height: 100%;
    z-index: -1;
  }
  div::after,
  div::before {
    content: "";
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    width: 100vw;
    z-index: 1;
  }
  div::after {
    bottom: 0;
    height: calc(50vh - 20vw);
  }
  div::before {
    top: 0;
    height: calc(50vh - 60vw);
  }
  canvas {
    /* width: 100vw;
    max-width: 450px; */
    height: 100%;
    position: absolute;
  }
</style>

<div>
  <canvas id="canvas" hidden />
</div>
