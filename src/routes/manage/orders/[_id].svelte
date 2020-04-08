<script context="module">
  export function preload({ params }) {
    return params;
  }
</script>

<script>
  import { onMount, tick } from "svelte";

  import modal from "../../../stores/modal";
  import { menus } from "../../../stores/menus";
  import { userLoaded } from "../../../stores/user";
  import {
    currentOrder,
    postOrder,
    patchOrder,
    selectOrder
  } from "../../../stores/orders";

  import MenuItems from "../../../components/MenuItems.svelte";

  export let _id;
  let qrUrl;

  let userReady = $userLoaded;

  $: {
    if (!userReady && $userLoaded) {
      selectOrder(_id);
    }
  }

  $: items = $currentOrder.sections.reduce(
    (prev, curr) => [...prev, ...curr.items],
    []
  );

  $: counters = $currentOrder.order;
  $: total = Object.keys(counters).reduce(
    (prev, curr) => {
      const item = items.find(i => i.referenceId === Number(curr));

      const addAmount = item.price * counters[Number(curr)];
      const addItems = counters[Number(curr)];

      return {
        price: prev.price + addAmount,
        items: prev.items + addItems
      };
    },
    { price: 0, items: 0 }
  );

  const handleSave = async () => {
    const order = {
      target: $currentOrder.target,
      items: Object.keys($currentOrder.order).reduce(
        (prev, curr) => [
          ...prev,
          ...new Array($currentOrder.order[curr])
            .fill({})
            .map(i => ({ referenceId: curr }))
        ],
        []
      )
    };
    if (_id === "new") {
      await postOrder(order);
    } else {
      await patchOrder({ orderId: _id, ...order });
    }
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
  .header {
    padding: 1em;
    display: grid;
    grid-template-columns: 1fr max-content;
    gap: 10px;
  }
  dl {
    min-height: 100vh;
  }
  dl,
  .loading {
    position: relative;
  }
  .loading {
    display: grid;
    place-items: center;
    height: 100vh;
  }
  dd {
    position: relative;
    overflow: hidden;
  }
  .footer {
    position: sticky;
    bottom: 0;
    width: 100%;
    height: 50px;
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    bottom: 0;
    z-index: 2;
    box-shadow: var(--shadow-m);
  }
  .footer > a {
    background-color: white;
    display: grid;
    place-items: center;
    padding: 0 1.5em;
  }
  .total {
    display: grid;
    grid-template-columns: 1fr max-content;
    align-items: center;
    gap: 20px;
    background-color: var(--cl-grey-light);
    padding: 0 1.5em;
  }
  .total > span {
    font-size: 120%;
    font-weight: 600;
  }
  .save {
    background-color: var(--cl-green);
    display: grid;
    place-items: center;
    padding: 0 1.5em;
  }
</style>

<main>

  {#if !userLoaded}
    <p class="loading">Loading Orders..</p>
  {:else}
    <dl>
      <dd class="header">
        <input
          bind:value={$currentOrder.target}
          placeholder="Add or scan target name" />
        <img src="scan.svg" height="40px" alt="scan order from customer" />
      </dd>
      <MenuItems {counters} sections={$currentOrder.sections} />
    </dl>
  {/if}

  <div class="footer">
    <a href="manage/orders">
      <img src="back.svg" height="15" alt="back to search" />
    </a>
    <div class="total">
      <p>{`${total.items} Items`}</p>
      <span>{`${total.price} €`}</span>
    </div>
    <button on:click={handleSave} class="save">
      <img src="check-w.svg" height="15" alt="save order" />
    </button>
  </div>
</main>
