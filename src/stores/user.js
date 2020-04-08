import { writable } from "svelte/store";

import { menus } from './menus';
import { orders } from './orders';
import { tick } from "svelte";

export const userLoaded = writable(false);
export const user = writable({
  name: "",
  description: "",
  street: "",
  zipCode: null,
  country: "",
  state: "",
  longitude: null,
  latitude: null
});

export const getUser = async () => {
  try {
    const res = await fetch("api/user");
    const { menus: menuItems, orders: orderItems, ...me } = await res.json();
    user.update(state => ({ ...state, ...me }));
    menus.update(state => menuItems);
    orders.update(state => orderItems);
    await tick();
    userLoaded.update(() => true);
  } catch (error) {
    console.log("Failed to get user");
    console.log(error);
  }
};

export const editUser = async values => {
  try {
    const res = await fetch("api/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });
    const data = await res.json();
    user.update(state => ({ ...state, ...data }));
  } catch (error) {
    console.log("Failed to update user");
    console.log(error);
  }
}