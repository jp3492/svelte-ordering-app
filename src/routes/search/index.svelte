<script>
  import { search, result, locate } from "../../stores/search";
  import modal from "../../stores/modal";

  const handleScan = () => {
    modal.update(() => ({
      component: "scan",
      props: {
        onSuccess: ({ detail: uderId }) => {
          modal.update(state => ({ component: "" }));
          goto(`menu/${userId}`);
        }
      }
    }));
  };
</script>

<style>
  main {
    margin: 0 auto;
    width: 100%;
    max-width: 1024px;
    min-height: 100vh;
    display: grid;
    grid-template-rows: max-content 1fr;
  }
  header {
    display: grid;
    align-items: center;
    grid-template-columns: max-content 1fr max-content max-content;
    padding: 0;
  }
  header > input {
    padding: 0 1em;
    height: 50px;
  }
  header > a {
    padding: 0 1em;
    display: grid;
    place-items: center;
  }
  button {
    box-shadow: none;
    background-color: white;
    padding: 0 1em;
    display: grid;
    place-items: center;
  }
  main > p {
    justify-self: center;
    padding: 3em 2em;
    width: 250px;
    text-align: center;
  }
  li {
    padding: 1em;
  }
  li > a {
    display: grid;
    grid-template-columns: 1fr max-content;
  }
  li > a > p {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
  }
  li > a > span {
    text-align: end;
  }
</style>

<svelte:head>
  <title>Find your Menu</title>
</svelte:head>
<main>
  <header>
    <a href="/">
      <img src="back.svg" alt="back to home" height="15px" />
    </a>
    <input type="text" placeholder="Search.." bind:value={$search} />
    <button on:click={locate}>
      <img src="pin.svg" height="30px" alt="locate nearby" />
    </button>
    <button on:click={handleScan}>
      <img src="scan.svg" height="30px" alt="scan qr code" />
    </button>
  </header>
  {#if $result.length === 0}
    <p>Search by name, location or scan a valid QR code..</p>
  {:else}
    <ul>
      {#each $result as { _id, name, description, distance }, index (_id)}
        <li>
          <a href={`menu/${_id}`}>
            <h2>{name}</h2>
            <p>{description}</p>
            <span>{`${distance | 0} m`}</span>
            <span>open</span>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</main>
