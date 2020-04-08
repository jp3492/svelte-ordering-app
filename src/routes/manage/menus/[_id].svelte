<script context="module">
  export async function preload({ params, query }) {
    return { ...params, ...query };
  }
</script>

<script>
  import { onMount, tick } from "svelte";
  import { goto } from "@sapper/app";
  import modal from "../../../stores/modal";

  import {
    menus,
    getMenu,
    postSection,
    editSection,
    removeSection,
    postItem,
    editItem,
    removeItem
  } from "../../../stores/menus";

  import AddMenu from "../../../components/AddMenu.svelte";
  import FooterOptions from "../../../components/FooterOptions.svelte";
  import SortableList from "../../../components/SortableList.svelte";
  import OptionsBar from "../../../components/OptionsBar.svelte";

  export let _id, action, target, id;

  let selectedSection;
  let optionsOpen = false;

  $: menu = $menus.find(m => m._id === _id);

  $: console.log(menu);

  $: openSections = menu ? menu.sections.map(s => s._id) : [];

  $: numberOfItems = menu
    ? menu.sections.reduce((prev, curr) => prev + curr.items.length, 0)
    : 0;

  $: console.log(numberOfItems);

  onMount(async () => {
    await getMenu(_id);
  });

  $: {
    if (!menu || !action || !target) {
      modal.update(m => ({
        component: "",
        props: {}
      }));
    } else {
      const component = `${action}${target.capitalize()}`;

      const targetObject =
        action === "add"
          ? {}
          : target === "section"
          ? menu.sections.find(s => s._id === id)
          : menu.sections
              .find(s => s._id === selectedSection)
              .items.find(i => i._id === id);

      const submit = (component => {
        switch (component) {
          case "addSection":
            return values =>
              postSection({
                ...values,
                menuId: _id,
                rank: menu.sections.length
              });
          case "addItem":
            return values =>
              postItem({
                ...values,
                referenceId: numberOfItems,
                menuId: _id,
                sectionId: selectedSection,
                rank: menu.sections.find(s => s._id === selectedSection).items
                  .length
              });
          case "editSection":
            return values =>
              editSection({
                ...targetObject,
                ...values,
                menuId: _id,
                sectionId: id
              });
          case "editItem":
            return values =>
              editItem({
                ...values,
                menuId: _id,
                sectionId: selectedSection,
                itemId: id,
                referenceId: targetObject.referenceId
              });
        }
      })(component);

      modal.update(state => ({
        component,
        props: {
          ...targetObject,
          submit
        }
      }));
    }
  }

  const handleSelect = e => {
    if (selectedSection === e.detail) {
      openSections = openSections.filter(_id => _id !== e.detail);
    } else if (!openSections.includes(e.detail)) {
      openSections = [...openSections, e.detail];
    }
    selectedSection = selectedSection === e.detail ? undefined : e.detail;
  };
  const handleDelete = ({ detail: { itemType, id } }) => {
    if (itemType === "section") {
      removeSection({ sectionId: id, menuId: _id });
    } else if (itemType === "item") {
      removeItem({ menuId: _id, sectionId: selectedSection, itemId: id });
    }
  };
  const handleAdd = () => goto(`manage/menus/${_id}?action=add&target=section`);
  const handleBack = () => goto("manage/menus");
  const handleSort = async newList => {
    menu.sections = newList.detail;
    await tick();
  };
  const handleItemsClick = ({ target }) => {
    const id = target.closest(".items").id;
    if (selectedSection !== id) {
      selectedSection = id;
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
  header {
    display: grid;
    column-gap: 10px;
    grid-template-columns: 1fr max-content;
    grid-template-areas:
      "name options"
      "description options";
    align-items: center;
  }

  header > h1 {
    grid-area: name;
  }

  header > p {
    grid-area: description;
  }

  ul {
    display: grid;
    row-gap: 1px;
    grid-auto-rows: max-content;
  }
  .sections {
    padding-bottom: 4em;
    z-index: 1;
  }
</style>

<main>

  {#if !menu}
    <div class="loading">Loading menu...</div>
  {:else}
    <header>
      <h1>{menu.name}</h1>
      <p>{menu.description}</p>
    </header>
    <ul class="sections">
      {#if menu.sections.length === 0}
        <div class="no-items">No Sections</div>
      {:else}
        <SortableList
          itemClass="menu-section"
          items={menu.sections}
          let:item
          let:handleMouseDown
          let:handleMouseUp
          selected={selectedSection}
          on:sort={handleSort}>
          <OptionsBar
            selected={selectedSection === item._id}
            on:select={handleSelect}
            on:delete={handleDelete}
            addHref={`${location.pathname}?action=add&target=item`}
            editHref={`${location.pathname}?action=edit&target=section&id=${item._id}`}
            {handleMouseDown}
            {handleMouseUp}
            itemType="section"
            id={item._id}
            label={item.name}
            description={item.description} />
          {#if openSections.includes(item._id)}
            <ul id={item._id} class="items" on:click={handleItemsClick}>
              <SortableList
                itemClass="menu-item"
                items={item.items}
                let:item
                let:handleMouseDown
                let:handleMouseUp
                let:selected
                selected={selectedSection}
                on:sort={handleSort}>
                <OptionsBar
                  selected={true}
                  editHref={`${location.pathname}?action=edit&target=item&id=${item._id}`}
                  on:delete={handleDelete}
                  id={item._id}
                  itemType="item"
                  {handleMouseDown}
                  {handleMouseUp}
                  label={item.name}
                  price={item.price}
                  shrink={true}
                  description={item.description} />
              </SortableList>
            </ul>
          {/if}
        </SortableList>
      {/if}
    </ul>
  {/if}
  <FooterOptions
    segment="menus"
    parent="menus"
    target="section"
    on:back={handleBack}
    on:add={handleAdd} />

</main>
