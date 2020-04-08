<script>
  import AuthObserver from "../../components/observer/AuthObserver.svelte";
  import Modal from "../../components/Modal.svelte";

  export let segment;
</script>

<style>
  main {
    z-index: 0;
    height: calc(100vh - 2em);
    max-width: 450px;
    position: relative;
    margin: 0 auto;
    overflow-x: hidden;
    display: grid;
    grid-template-rows: max-content 1fr max-content;
    padding: 1em 2em;
  }
  main::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("/background.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    filter: grayscale(45%) blur(1px);
    z-index: -1;
  }
  .info {
    position: absolute;
    top: 0.5em;
    right: 0;
    filter: drop-shadow(2px 2px 8px black);
  }

  header {
    padding: 3em 0 2em 0;
    display: grid;
    gap: 20px;
    border: none;
    position: relative;
  }

  header > a > h1 {
    font-family: Lobster;
    font-size: 350%;
    font-weight: 200;
    color: white;
    text-align: center;
    text-shadow: var(--shadow-text-m);
  }
</style>

<!--
  This layout is only for the landing, auth and about page
  manage/*, search/* and menu/* will have other templates
 -->
<AuthObserver {segment} />

<main>

  <header>
    <a href="/home">

      <h1>Flipper</h1>
    </a>
    <img
      class="info"
      src="info-circle-w.svg"
      height="35"
      alt="more information" />
  </header>
  <slot />
</main>

<Modal />
