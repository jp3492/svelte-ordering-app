<script>
  import { createEventDispatcher } from "svelte";

  export let segment,
    parent = "",
    icon = "plus";

  const dispatch = createEventDispatcher();

  const handleBack = () => dispatch("back");

  const handleAdd = () => dispatch("add");
</script>

<style>
  nav {
    box-shadow: var(--shadow-s);
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    position: fixed;
    bottom: 0;
    place-items: stretch;
    background-color: white;
    z-index: 2;
    margin: 0 auto;
    width: 100%;
    max-width: 1024px;
  }

  div {
    display: grid;
    grid-auto-flow: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 0 1em;
  }

  div:first-of-type {
    justify-self: start;
  }

  div:last-of-type {
    justify-self: end;
    background-color: var(--cl-selected);
    padding: 1em 2em;
  }

  label {
    line-height: normal;
  }
  .nav {
    display: grid;
    grid-auto-flow: column;
    place-items: stretch;
    gap: 0;
  }

  .nav > a {
    display: grid;
    place-items: center;
  }
  .nav button {
    box-shadow: none;
    background-color: transparent;
    padding: 0.5em 1em;
  }
  .logout {
    background-color: var(--cl-red) !important;
  }
</style>

<nav>
  <div on:click={handleBack}>
    <img src="back.svg" alt={`back to ${parent}`} height="15px" />
  </div>

  <div class="nav">
    <a class:selected={segment === 'menus'} href="manage/menus" rel="prefetch">
      <button>
        <label>Menus</label>
      </button>
    </a>
    <a
      class:selected={segment === 'orders'}
      href="manage/orders"
      rel="prefetch">
      <button>
        <label>Orders</label>
      </button>
    </a>
  </div>

  <div class:logout={icon === 'logout-w'} on:click={handleAdd}>
    <img src={icon + '.svg'} alt={icon} height="15px" />
  </div>
</nav>
