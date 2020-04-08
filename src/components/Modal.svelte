<script>
  import { goto } from "@sapper/app";
  import { fade } from "svelte/transition";

  import modal from "../stores/modal";

  import AddMenu from "./AddMenu.svelte";
  import EditMenu from "./EditMenu.svelte";
  import AddSection from "./AddSection.svelte";
  import EditSection from "./EditSection.svelte";
  import AddItem from "./AddItem.svelte";
  import EditItem from "./EditItem.svelte";
  import OrderQrCode from "./OrderQrCode.svelte";
  import Scan from "./QRScanner/index.svelte";

  $: Component = (component => {
    switch (component) {
      case "scan":
        return Scan;
      case "addMenu":
        return AddMenu;
      case "editMenu":
        return EditMenu;
      case "addSection":
        return AddSection;
      case "editSection":
        return EditSection;
      case "addItem":
        return AddItem;
      case "editItem":
        return EditItem;
      case "orderQrCode":
        return OrderQrCode;
      default:
        return null;
    }
  })($modal.component);

  const closeModal = () => {
    goto(window.location.pathname);
    modal.update(v => ({
      component: null,
      props: {}
    }));
  };
</script>

<style>
  #modal {
    z-index: 2;
    position: fixed;
    top: 0;
    left: 0;

    height: 100vh;
    width: 100%;
    place-content: center;

    background-color: var(--cl-grey-opace);
    display: none;
    padding: 2em;
  }

  #modal.open {
    display: grid;
  }

  #modal > div {
    padding: 1em;
    background-color: white;
    box-shadow: var(--shadow-l);
  }
  #modal.top {
    align-content: start;
  }
</style>

<div
  in:fade={{ delay: 250, duration: 1000 }}
  on:click={closeModal}
  class:top={$modal.push === 'top'}
  class:open={Component !== null}
  id="modal">
  <div on:click|stopPropagation>
    <svelte:component this={Component} {...$modal.props} />
  </div>
</div>
