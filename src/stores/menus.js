import { tick } from 'svelte';
import { goto } from "@sapper/app";
import { writable } from 'svelte/store';
import modal from './modal';
import { currentOrder } from './orders';

export const menus = writable([]);

let localState = [];

menus.subscribe(state => {
  localState = state;
  const mergedSections = state.reduce((prev, curr) =>
    [...prev, ...curr.sections],
    []).sort((a, b) => b.rank - b.rank);
  currentOrder.update(s => ({ ...s, sections: mergedSections }));
});

export const getMenus = async () => {
  try {
    const res = await fetch("api/menu");
    const { items } = await res.json();
    menus.update(state => items);
  } catch (error) {
    console.log("Failed to get menus");
    console.log(error);
  }
};

export const postMenu = async newMenu => {
  try {
    const res = await fetch("api/menu", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newMenu)
    });
    const menu = await res.json();
    menus.update(state => [...state, menu]);
    modal.update(() => ({
      component: "",
      props: {}
    }));
    await tick();
    goto(`manage/menus/${menu._id}`);
  } catch (error) {
    console.log("Failed to create menu");
    console.log(error);
  }
};

export const getMenu = async menuId => {
  try {
    const res = await fetch(`api/menu/${menuId}`);
    const menu = await res.json();
    return menus.update(state => {
      const menuExistsAlready = !!state.find(m => m._id === menuId);
      if (menuExistsAlready) {
        return state.map(m => m._id === menuId ? menu : m);
      }
      return [...state, menu];
    });
  } catch (error) {
    console.log("Failed to get Menu on Frontend");
    console.log(error);
    return error;
  }
};

export const getMenuByUser = async userId => {
  try {
    const res = await fetch(`api/user/${userId}/menu`);
    const data = await res.json();
    currentOrder.update(state => ({ ...state, ...data }));
  } catch (error) {
    console.log("Failed to get Menu by User");
    console.log({ error });
  }
};

export const activateMenu = async ({ menuId, active }) => {
  try {
    console.log({ menuId, active });

    const res = await fetch(`api/menu/${menuId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ active })
    });
    const updatedMenu = await res.json();
    menus.update(state => state.map(menu => menu._id === menuId ? updatedMenu : menu));
  } catch (error) {
    console.log("Failed to activate Menu");
    console.log(error);
  }
};

export const editMenu = async ({ menuId, ...values }) => {
  try {
    const res = await fetch(`api/menu/${menuId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });
    const updatedMenu = await res.json();
    menus.update(state => state.map(menu => menu._id === menuId ? updatedMenu : menu));
    await tick();
    goto("manage/menus");
  } catch (error) {
    console.log("Failed to edit Menu");
    console.log(error);
  }
};

export const removeMenu = async menuId => {
  try {
    await fetch(`api/menu/${menuId}`, {
      method: "DELETE"
    });
    menus.update(state => state.filter(m => m._id !== menuId));
    await tick();
  } catch (error) {
    console.log("Failed to remove Menu");
    console.log(error);
  }
}

export const postSection = async ({ menuId, ...newSection }) => {
  try {
    const res = await fetch(`api/menu/${menuId}/section`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newSection)
    });
    const updatedMenu = await res.json();
    menus.update(state => state.map(menu => menu._id === menuId ? updatedMenu : menu));
    await tick();
    goto(location.pathname);
  } catch (error) {
    console.log("Failed to add section.");
    console.log(error);
  }
};

export const editSection = async ({ menuId, sectionId, ...updatedSection }) => {
  try {
    const res = await fetch(`api/menu/${menuId}/section/${sectionId}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedSection)
    });
    const updatedMenu = await res.json();
    menus.update(state => state.map(menu => menu._id === menuId ? updatedMenu : menu));
    await tick();
    goto(location.pathname);
  } catch (error) {
    console.log("Failed to edit Section");
    console.log(error);
  }
};

export const removeSection = async ({ menuId, sectionId }) => {
  try {
    const res = await fetch(`api/menu/${menuId}/section/${sectionId}`, {
      method: "DELETE"
    });
    const updatedMenu = await res.json();
    menus.update(state => state.map(menu => menu._id === menuId ? updatedMenu : menu));
    await tick();
  } catch (error) {
    console.log("Failed to delete Section");
    console.log(error);
  }
};

export const sortSections = async ({ menuId, sections }) => {
  try {
    const res = await fetch(`api/menu/${menuId}/section`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ sections })
    });
    const updatedMenu = await res.json();
    menus.update(state => state.map(menu => menu._id === menuId ? updatedMenu : menu));
    await tick();
    goto(location.pathname);
  } catch (error) {
    console.log("Failed to add section.");
    console.log(error);
  }
};

export const postItem = async ({ menuId, sectionId, ...newItem }) => {
  try {
    const section = localState.find(m => m._id === menuId).sections.find(s => s._id === sectionId);
    const updatedSection = { ...section, items: [...section.items, newItem] };
    editSection({ menuId, sectionId, ...updatedSection });
    goto(location.pathname);
  } catch (error) {
    console.log("Failed to add new Item.");
    console.log(error);
  }
};

export const editItem = async ({ menuId, sectionId, itemId, ...updatedItem }) => {
  try {
    const section = localState.find(m => m._id === menuId).sections.find(s => s._id === sectionId);
    const updatedSection = { ...section, items: section.items.map(i => i._id === itemId ? updatedItem : i) };
    editSection({ menuId, sectionId, ...updatedSection });
    goto(location.pathname);
  } catch (error) {
    console.log("Failed to edit Item.");
    console.log(error);
  }
};

export const removeItem = async ({ menuId, sectionId, itemId }) => {
  try {
    console.log({ menuId, sectionId, itemId });

    const section = localState.find(m => m._id === menuId).sections.find(s => s._id === sectionId);
    console.log(section);

    const updatedSection = { ...section, items: section.items.filter(i => i._id !== itemId) };
    editSection({ menuId, sectionId, ...updatedSection });
  } catch (error) {
    console.log("Failed to delete Item.");
    console.log(error);
  }
};

export const sortItems = async ({ menuId, sectionId, items }) => {
  try {
    const section = localState.find(m => m._id === menuId).sections.find(s => s._id === sectionId);
    const updatedSection = { ...section, items };
    editSection({ menuId, sectionId, ...updatedSection });
  } catch (error) {
    console.log("Failed to sort Items.");
    console.log(error);
  }
};