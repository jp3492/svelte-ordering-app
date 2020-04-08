<script context="module">
  import { goto } from "@sapper/app";

  import FooterOptions from "../../components/FooterOptions.svelte";

  export function preload(page, session) {
    if (session.user === null) {
      goto("/auth/login");
    }
    return {};
  }
</script>

<script>
  import { tick, onMount } from "svelte";
  import QRious from "qrious";

  import { user, editUser } from "../../stores/user";
  import { logout } from "../../services/auth";
  import { currentOrder } from "../../stores/orders";

  export let segment;
  let qrUrl, name;

  let initialValues;
  let values = {};

  let active = $currentOrder.length === 0;

  const updateQr = id => {
    const newQr = new QRious({
      element: document.getElementById("qr"),
      value: id
    });
  };

  user.subscribe(state => {
    values = state;
    initialValues = { ...values };
    if (state._id && state._id !== "") {
      updateQr(state._id);
    }
  });

  onMount(() => {
    if (values._id) {
      updateQr(values._id);
    }
  });

  let editing = false;

  let position;

  const handleEdit = async () => {
    if (editing) {
      if (JSON.stringify(initialValues) !== JSON.stringify(values)) {
        await editUser(values);
      }
      editing = false;
    } else {
      editing = true;
    }
  };

  const handleLocation = () => {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        values = {
          ...values,
          longitude: position.coords.longitude.toFixed(6),
          latitude: position.coords.latitude.toFixed(6)
        };
      });
    }
  };

  const handleBack = () => goto("/search");
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
  section {
    display: grid;
    grid-template-rows: max-content 1fr max-content 30px;
    padding: 1em;
  }
  header {
    display: grid;
    grid-template-columns: 1fr max-content;
    align-items: center;
  }
  header > button {
    background-color: transparent;
  }
  button {
    width: 100%;
    box-shadow: none;
    display: grid;
  }
  .qr {
    max-height: 300px;
    display: grid;
    place-items: center;
  }
  .qr > img {
    position: relative;
    height: 100%;
  }
  .coordinates {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 10px;
    border-top: 1px solid var(--cl-selected);
    padding: 1em;
  }

  label {
    font-size: 120%;
  }
  .coordinates > button {
    grid-row: 1 / 3;
    grid-column: 1 / 2;
  }
  .coordinates > p {
    grid-row: 2 / 3;
    font-size: 85%;
    color: grey;
    align-self: center;
  }

  button.disabled {
    background-color: transparent;
  }

  .editable {
    background-color: var(--cl-grey-light);
  }
</style>

<main>
  <header>
    {#if !editing}
      <h1>{values.name}</h1>
    {:else}
      <h1
        class="editable"
        contenteditable="true"
        bind:textContent={values.name}>
        {values.name}
      </h1>
    {/if}
    <button on:click={handleEdit}>
      {#if !editing}
        <img src="edit.svg" height="23px" alt="edit account" />
      {:else}
        <img src="check.svg" height="23px" alt="edit account" />
      {/if}
    </button>
  </header>

  <section>
    {#if !editing}
      <p>{values.description}</p>
    {:else}
      <p
        class="editable"
        contenteditable="true"
        bind:textContent={values.description}>
        {values.description}
      </p>
    {/if}
    <div class="qr">
      <canvas id="qr" />
    </div>
    <div class="coordinates">
      <label>Coordinates</label>
      <p>
        {`lng: ${values.longitude ? values.longitude : 'not set'}, lat: ${values.latitude ? values.latitude : 'not set'}`}
      </p>

      <button class:disabled={!editing} on:click={handleLocation}>
        <img src="pin.svg" height="30px" alt="detect location" />
      </button>
    </div>
  </section>

  <FooterOptions
    {segment}
    target="logout"
    icon="logout-w"
    on:add={logout}
    on:back={handleBack} />
</main>
