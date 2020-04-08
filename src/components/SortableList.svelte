<script>
  import { tick, createEventDispatcher } from "svelte";

  export let items, itemClass, selected;

  let draggedItem;

  const dispatch = createEventDispatcher();

  $: dispatch("statusChange", !!draggedItem);

  const handleSort = (from, to) =>
    dispatch("sort", items.move(Number(from), Number(to)));

  const handleDragStart = e => {
    if (draggedItem) {
      e.dataTransfer.setData("text", draggedItem);
    }
  };

  const handleDrop = async e => {
    if (!draggedItem) {
      return;
    }
    draggedItem = undefined;

    const fromIndex = e.dataTransfer.getData("text");
    const toIndex =
      e.target.id !== "" ? e.target.id : e.target.closest(".item").id;

    handleSort(fromIndex, toIndex);
  };

  const handleMouseDown = async e => {
    draggedItem = e.target.closest(".wrapper").id;
    await tick();
  };

  const handleMouseUp = async e => {
    draggedItem = undefined;
    await tick();
  };
</script>

<style>
  li {
    position: relative;
    display: grid;
    align-items: center;
  }

  .selected {
    background-color: var(--cl-grey-light);
  }
  .dragging {
    background-color: white;
  }
</style>

{#each items as item, index (item._id)}
  <li
    class={`item ${itemClass || ''}`}
    class:selected={selected === item._id}
    class:dragging={Number(draggedItem) === index}
    id={index}
    draggable="true"
    on:dragover|preventDefault
    on:drop|preventDefault={handleDrop}
    on:dragstart={handleDragStart}
    on:mouseup={handleMouseUp}>
    <slot {item} {handleMouseUp} {handleMouseDown} {selected} />
  </li>
{/each}
