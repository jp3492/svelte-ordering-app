<script>
  import QRScanner from "./scanner.svelte";
  import modal from "../../stores/modal";

  export let onSuccess;

  const closeModal = () => modal.update(() => ({}));
</script>

<style>
  .qr {
    position: fixed;
    overflow: hidden;
    top: 0;
    left: 0;
    background-color: white;
    height: 100vh;
    width: 100vw;
    box-shadow: inset 0 calc(50vh - 60vw) 0 rgba(0, 0, 0, 0.4),
      inset 0 calc(-50vh + 20vw) 0 rgba(0, 0, 0, 0.4);
  }
  .qr::before,
  .qr::after {
    content: "";
    position: absolute;
    height: 80vw;
    width: 10vw;
    top: calc(50vh - 60vw);
    background-color: rgba(0, 0, 0, 0.4);
  }
  .qr::before {
    left: 0;
  }
  .qr::after {
    right: 0;
  }
  button {
    position: fixed;
    top: 2em;
    right: 2em;
    z-index: 2;
    background-color: transparent;
    padding: 0;
    box-shadow: none;
  }
</style>

<main class="qr">
  <QRScanner on:success={onSuccess} />
  <button on:click={closeModal}>
    <img src="close-w.svg" height="25px" alt="close scanner" />
  </button>
</main>
