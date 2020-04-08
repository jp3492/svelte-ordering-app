<script>
  import { tick, createEventDispatcher } from "svelte";

  export let editHref,
    addHref,
    label = "",
    description = "",
    price,
    id,
    itemType,
    selected,
    shrink = false,
    // handleMouseUp,
    // handleMouseDown,
    checkboxEnabled = false,
    active,
    loading = false;

  let open = false,
    originTouch;

  let height = shrink ? "12" : "15";

  let timer;

  const dispatch = createEventDispatcher();

  const handleClick = e => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (e.target.tagName !== "IMG") {
        if (selected) {
          open = false;
        }
        dispatch("select", id);
      }
    }, 300);
  };

  const handleDoubleClick = () => {
    if (checkboxEnabled) {
      clearTimeout(timer);
      dispatch("activate", id);
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure?")) {
      dispatch("delete", { id, itemType });
    }
  };

  const handleTouch = e => {
    var { clientX, clientY } = e.touches[0] || e.changedTouches[0];
    if (e.type === "touchstart") {
      originTouch = {
        clientX,
        clientY
      };
    } else if (originTouch) {
      const distance = clientX - originTouch.clientX;
      originTouch = undefined;
      if (Math.abs(distance) > 30) {
        const swipeLeft = distance < 0;
        if (swipeLeft) {
          if (active) {
            dispatch("activate", id);
          } else {
            open = true;
          }
        } else {
          if (open) {
            open = false;
          } else if (checkboxEnabled) {
            dispatch("activate", id);
          }
        }
      }
    }
  };

  const handleGlobalClick = e => {
    if (
      !e.target.closest(".content") ||
      e.target.closest(".content").id !== `${itemType}-${id}`
    ) {
      open = false;
      document.removeEventListener("click", handleGlobalClick);
    }
  };

  const handleOptionsClick = async e => {
    if (!selected && !["menu", "order"].includes(itemType)) {
      dispatch("select", id);
      await tick();
    }
    open = !open;
    await tick();
    document.addEventListener("click", handleGlobalClick);
  };

  const handleSortClick = () => dispatch("sort", id);
</script>

<style>
  .wrapper {
    position: relative;
    overflow: hidden;
    border-top: 1px solid var(--cl-selected);
    background-color: white;
  }
  .wrapper:first-of-type {
    border: none;
  }
  .isLoading::after {
    content: "Saving..";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--cl-grey-opace);
    display: grid;
    place-items: center;
    left: 0;
    top: 0;
    z-index: 3;
    color: var(--cl-grey-dark);
  }
  .selected > .content {
    background-color: var(--cl-selected);
  }
  nav {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    height: 100%;
    width: 100px;

    display: grid;
    grid-auto-flow: column;
  }

  nav > a,
  nav > span {
    display: grid;
    place-content: center;
  }

  .menu-active {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    height: 100%;
    width: 60px;

    background-color: var(--cl-green);
    display: grid;
    place-items: center;
  }

  .content {
    position: relative;
    z-index: 2;

    display: grid;
    align-items: center;
    grid-template-columns: 1fr max-content max-content;

    padding: 0.5em 0.5em 0.5em 1em;

    background-color: white;

    transform: translateX(0);
    transition: transform 0.15s cubic-bezier(0, 0, 0.2, 1);

    box-shadow: var(--shadow-s);
    column-gap: 5px;
  }
  label {
    font-weight: 500;
    font-size: 120%;
    width: 100%;
    transform-origin: bottom left;
    transform: translateX(0) scale(1);
    transition: transform 0.15s cubic-bezier(0, 0, 0.2, 1),
      width 0.15s cubic-bezier(0, 0, 0.2, 1);
  }
  .noDescription > label {
    transform-origin: left;
  }
  p {
    grid-row: 2 / 3;
    grid-column: 1 / 2;
    font-size: 90%;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    transform-origin: top left;
    transform: translateX(0) scale(1);
    transition: transform 0.15s cubic-bezier(0, 0, 0.2, 1),
      width 0.15s cubic-bezier(0, 0, 0.2, 1);
  }
  .content > span {
    grid-column: 3 / 4;
    grid-row: 1 / 3;

    align-self: center;
    font-size: 90%;

    height: 30px;
    width: 30px;

    display: grid;
    place-items: center;
  }
  .content > div {
    grid-row: 1 / 3;
    align-self: center;
    font-size: 100%;
    transform-origin: left center;
    transform: scale(1);
    transition: transform 0.15s cubic-bezier(0, 0, 0.2, 1);
  }
  .open {
    transform: translateX(-100px);
  }
  .open > p,
  .open > label {
    transform: translateX(100px) scale(0.7);
    width: calc(100% - 100px);
  }
  .open > div {
    transform: scale(0.7);
  }
  .shrink > .content {
    padding: 0.2em 0.5em 0.2em 1em;
  }
  .shrink > .content > label {
    font-size: 100%;
    font-weight: 500;
  }
  .shrink > .content > p {
    font-size: 80%;
  }
  .shrink.selected > .content {
    background-color: var(--cl-grey-light);
    padding-left: 1.5em;
  }
  .content.active {
    transform: translateX(60px);
  }
</style>

<div {id} class:isLoading={loading} class:shrink class:selected class="wrapper">
  <div
    id={`${itemType}-${id}`}
    on:dblclick|preventDefault|stopPropagation={handleDoubleClick}
    class:open
    class:active
    class:noDescription={!description}
    class="content"
    on:click={handleClick}
    on:touchstart={handleTouch}
    on:touchend={handleTouch}>
    <label>{label}</label>
    <p>{description}</p>
    <div>{price ? `${price} €` : ''}</div>
    <span on:click={handleOptionsClick}>
      <img src="menu-vert.svg" {height} alt="open options" />
    </span>
  </div>
  <div class="menu-active">
    <img src="check-w.svg" height="25" alt="menu is active" />
  </div>
  <nav>
    {#if handleDelete}
      <span on:click={handleDelete}>
        <img src="trash.svg" alt="trigger delete event" {height} />
      </span>
    {/if}
    {#if editHref}
      <a href={editHref}>
        <img src="edit.svg" alt="trigger edit event" {height} />
      </a>
    {/if}
    {#if addHref}
      <a href={addHref}>
        <img src="plus.svg" {height} alt="add item" />
      </a>
    {/if}
    <!-- <span
      on:mousedown={handleMouseDown}
      on:mouseup={handleMouseUp}
      on:click={handleSortClick}>
      <img src="unfold.svg" alt="trigger sort event" {height} />
    </span> -->
  </nav>
</div>
