<script context="module">
  export async function preload({ query }) {
    return query;
  }
</script>

<script>
  import { onMount, tick } from "svelte";
  import { goto } from "@sapper/app";
  import modal from "../../../stores/modal";
  import {
    menus,
    getMenus,
    postMenu,
    editMenu,
    removeMenu,
    activateMenu
  } from "../../../stores/menus";
  import OptionsBar from "../../../components/OptionsBar.svelte";
  import FooterOptions from "../../../components/FooterOptions.svelte";

  export let action, id;

  let loading = $menus.length === 0;

  let deletingItems = [];

  onMount(async () => {
    await getMenus();
    loading = false;
  });

  $: {
    if (action === "add") {
      modal.update(state => ({
        component: "addMenu",
        props: {
          submit: postMenu
        }
      }));
    } else if ($menus.length !== 0 && action === "edit") {
      const { _id, ...menu } = $menus.find(m => m._id === id);
      modal.update(state => ({
        component: "editMenu",
        props: {
          submit: values => editMenu({ ...values, menuId: _id }),
          ...menu
        }
      }));
    } else {
      modal.update(state => ({
        component: "",
        props: {}
      }));
    }
  }

  const handleClick = _id => goto(`manage/menus/${_id}`);

  const handleActivate = props => activateMenu(props);

  const handleEdit = _id => goto(`manage/menus?action=edit&id=${_id}`);

  const handleDelete = async _id => {
    deletingItems = [...deletingItems, _id];
    await tick();
    removeMenu(_id);
  };

  const handleAdd = () => goto("manage/menus?action=add");

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
  }
  header {
    height: max-content;
    display: grid;
    align-items: center;
  }
</style>

<main>
  <header>
    <h1>Menus</h1>
  </header>

  <section>
    {#if loading}
      <div class="loading">Loading Menus...</div>
    {:else if $menus.length === 0}
      <div class="no-items">
        No Menus. Click "+ Menu" on the bottom to create your first menu.
      </div>
    {:else}
      <ul>
        {#each $menus as { _id, name, description, items, active }}
          <OptionsBar
            {active}
            checkboxEnabled={true}
            on:select={() => handleClick(_id)}
            on:activate={id => handleActivate({
                menuId: id.detail,
                active: !active
              })}
            on:delete={() => handleDelete(_id)}
            editHref={`manage/menus?action=edit&id=${_id}`}
            itemType="menu"
            id={_id}
            label={name}
            {description} />
        {/each}
      </ul>
    {/if}
  </section>

  <FooterOptions
    segment="menus"
    on:back={handleBack}
    on:add={handleAdd}
    parent="manage"
    target="menu" />

</main>
