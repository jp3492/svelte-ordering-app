<script>
  import { onMount, tick } from "svelte";
  import { goto } from "@sapper/app";
  import modal from "../../../stores/modal";
  import {
    orders,
    currentOrder,
    selectOrder,
    postOrder,
    loadingOrders
  } from "../../../stores/orders";

  import OptionsBar from "../../../components/OptionsBar.svelte";
  import FooterOptions from "../../../components/FooterOptions.svelte";

  $: activeOrders = $orders.filter(o => !o.paid);
  $: paidOrders = $orders.filter(o => o.paid);
  $: postingOrder = $orders.find(o => !o._id);

  $: items = $currentOrder.sections.reduce(
    (prev, curr) => [...prev, ...curr.items],
    []
  );

  $: console.log(items);

  $: totals = $orders.reduce(
    (prev, curr) => ({
      ...prev,
      [curr._id]: curr.items.reduce(
        (prev, curr) =>
          items.find(i => i.referenceId == curr.referenceId).price + prev,
        0
      )
    }),
    {}
  );

  const handleClick = _id => selectOrder(_id);

  const handleDelete = _id => removeOrder(_id);

  const handleAdd = () => goto("manage/orders/new");

  const handleBack = () => goto("manage");

  const handleDoubleClick = () => {};
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
    grid-auto-rows: max-content;
  }
  header {
    height: max-content;
    display: grid;
    align-items: center;
  }
  h2 {
    font-weight: 400;
    background-color: var(--cl-selected);
    /* border-bottom: 1px solid var(--cl-selected); */
    padding: 0.2em 1em;
    color: var(--cl-grey-dark);
    font-size: 100%;
  }
</style>

<main>
  <header>
    <h1>Orders</h1>
  </header>
  <section>
    {#if $orders.length === 0}
      <div class="no-items">No Orders made yet.</div>
    {:else}
      <h2>Active</h2>
      <ul>
        {#each activeOrders as { _id, items, target, updatedAt }}
          <OptionsBar
            loading={!_id || $loadingOrders.includes(_id)}
            on:select={() => handleClick(_id)}
            on:delete={() => handleDelete(_id)}
            itemType="order"
            id={_id}
            label={target}
            price={`(${items.length}) ${totals[_id]}`}
            description={updatedAt ? updatedAt.formatToDate() : 'now'} />
        {/each}
      </ul>
      <h2>Paid</h2>
      <ul>
        {#each paidOrders as { _id, items, target, updatedAt }}
          <OptionsBar
            on:select={() => handleClick(_id)}
            on:delete={() => handleDelete(_id)}
            itemType="order"
            id={_id}
            label={target}
            description={updatedAt.formatToDate()} />
        {/each}
      </ul>
    {/if}
  </section>

  <FooterOptions
    segment="orders"
    on:back={handleBack}
    on:add={handleAdd}
    parent="manage"
    target="menu" />
</main>
