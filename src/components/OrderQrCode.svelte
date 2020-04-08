<script>
  export let qrUrl;
</script>

<style>
  .qr {
    display: grid;
    place-items: center;
    overflow: hidden;
  }
  img {
    transform: scale(1.2);
    transform-origin: center;
  }
</style>

<div class="qr">
  <img src={qrUrl} alt="qr code" height="250" />
</div>
