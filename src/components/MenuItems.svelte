<script>
  import { tick } from "svelte";
  import { addItemToOrder, removeItemFromOrder } from "../stores/orders";
  export let sections, counters;

  const handleClick = e => addItemToOrder(e.target.closest(".item").id);

  let touchedId;
  let touchedItem;
  let originTouch;
  let deleteActive = false;

  console.log(sections, counters);

  const handleTouch = async e => {
    const id = e.target.closest(".item").id;

    if (!counters[id] || counters[id] === 0) {
      return;
    }

    const { clientX, clientY } = e.touches[0] || e.changedTouches[0];
    const img = e.target.closest(".item").querySelector(".remove > img");

    switch (e.type) {
      case "touchstart":
        touchedItem = e.target.closest(".content");
        touchedId = id;
        originTouch = { clientX, clientY };
        touchedItem.classList.remove("reset");
        break;
      case "touchmove":
        const diff = Math.abs(originTouch.clientX - clientX);
        if (clientX < originTouch.clientX && diff <= 100) {
          touchedItem.style.transform = `translateX(-${diff}px)`;
        } else if (diff > 100) {
          deleteActive = true;
        }
        if (diff > 75 && diff <= 120) {
          const progress = diff - 75;
          const change = (progress * 100) / 25 / 100;
          const scaleImg = 1 + 0.3 * change;
          img.style.transform = `scale(${scaleImg})`;
        }
        break;
      case "touchend":
        img.style.transform = `scale(1)`;
        // Need to check for swipe left
        if (deleteActive) {
          removeItemFromOrder(touchedId);
          await tick();
          touchedItem.classList.add("reset");
        }
        touchedItem.style.transform = `translateX(0)`;
        touchedItem = undefined;
        originTouch = undefined;
        deleteActive = false;
    }
  };
</script>

<style>
  .reset {
    transition: transform 0.1s ease-in;
  }
  .remove {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    height: 100%;
    width: 100px;

    display: grid;
    place-items: center;
    background-color: var(--cl-red);
  }
  .remove > img {
    transform: scale(1);
    transition: transform 0.1s ease-out;
  }
  .content {
    position: relative;
    z-index: 2;
    padding: 1em 1.5em;
    display: grid;
    grid-template-columns: 1fr max-content max-content;
    align-items: center;
    column-gap: 10px;
    background-color: white;
    box-shadow: var(--shadow-s);
    transform: translateX(0);
    /* transition: transform 0.1s ease-out; */
  }
  .content > div {
    grid-row: 1 / 3;
    font-size: 85%;
    color: var(--cl-grey);
  }
  .content > p {
    font-size: 80%;
    grid-row: 2 / 3;
  }
  .content > span {
    grid-column: 3 / 4;
    grid-row: 1 / 3;
  }
  dd {
    position: relative;
    overflow: hidden;
  }
  dt {
    padding: 0.2em 1em;
    background-color: var(--cl-grey-light);
  }
  dt > label,
  dt > p {
    font-size: 85%;
  }
  dt > label {
    font-weight: 600;
  }
</style>

{#each sections as { _id, name, description, items }, index (_id)}
  <dt id={_id}>
    <label>{name}</label>
    <p>{description}</p>
  </dt>
  {#each items as item, index (item._id)}
    <dd
      on:touchstart={handleTouch}
      on:touchmove={handleTouch}
      on:touchend={handleTouch}
      id={item.referenceId}
      class="item reset"
      on:click={handleClick}>
      <div class="content">
        <label>{item.name}</label>
        <p>{item.description}</p>
        <div>
          {counters[item.referenceId] ? `(${counters[item.referenceId]})` : ''}
        </div>
        <span>{`${item.price} €`}</span>
      </div>
      <div class="remove">
        <img src="trash-w.svg" height="20px" alt="remove item from order" />
      </div>
    </dd>
  {/each}
{/each}
