<script context="module">
  export function preload({ query, params }) {
    return { ...query, ...params };
  }
</script>

<script>
  import QRious from "qrious";
  import { onMount, tick } from "svelte";
  import modal from "../../stores/modal";
  import { getMenuByUser } from "../../stores/menus";
  import { currentOrder } from "../../stores/orders";

  import MenuItems from "../../components/MenuItems.svelte";

  export let userId,
    showQr = false;

  let loading = $currentOrder.userId !== userId;
  let qrUrl;

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

  let setQr;

  $: {
    if (setQr) {
      setQr(counters);
      //
    }
  }

  onMount(() => {
    setQr = values => {
      var newQr = new QRious({
        value: JSON.stringify(values)
      });
      const url = newQr.toDataURL();

      qrUrl = url;
    };
  });

  $: showQr
    ? modal.update(state => ({
        component: "orderQrCode",
        push: "top",
        props: {
          qrUrl
        }
      }))
    : modal.update(state => ({
        component: "",
        props: {}
      }));

  onMount(async () => {
    await getMenuByUser(userId);
    currentOrder.update(state => ({ ...state, userId }));
    await tick();
    loading = false;
  });
</script>

<style>
  .header {
    padding: 1em;
  }
  dl {
    position: relative;
    min-height: 100vh;
  }
  dd {
    position: relative;
    overflow: hidden;
  }
  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 50px;
    display: grid;
    grid-template-columns: max-content 1fr;
    position: sticky;
    bottom: 0;
    z-index: 2;
    box-shadow: var(--shadow-m);
  }
  .footer > a:first-of-type {
    background-color: white;
    display: grid;
    grid-auto-flow: column;
    place-items: center;
    gap: 10px;
    padding: 0 1.5em;
  }
  .total {
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    align-items: center;
    gap: 20px;
    background-color: var(--cl-grey-light);
    padding: 0 1.5em;
  }
  .total > span {
    font-size: 120%;
    font-weight: 600;
  }
</style>

<dl>
  {#if loading}
    <div class="loading">Loading menu...</div>
  {:else if !$currentOrder.information._id}
    <div class="no-item">No Menu found :(</div>
  {:else}
    <dd class="header">
      <h1>{$currentOrder.information.name}</h1>
      <p>{$currentOrder.information.description}</p>
    </dd>
    <MenuItems {counters} sections={$currentOrder.sections} />
  {/if}
</dl>

<div class="footer">
  <a href="/search">
    <img src="back.svg" height="10" alt="back to search" />
  </a>
  <a href={`menu/${userId}?showQr=true`} class="total">
    <img src="scan.svg" alt="show qr code" height="30" />
    <p>{`${total.items} Items`}</p>
    <span>{`${total.price} €`}</span>
  </a>
</div>
