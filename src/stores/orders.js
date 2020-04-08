import { writable } from 'svelte/store';
import { goto } from "@sapper/app";

export const loadingOrders = writable([]);
export const orders = writable([]);
export const currentOrder = writable({
  target: "",
  information: {},
  sections: [],
  order: {}
});

orders.subscribe(state => state.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));

export const patchOrder = async ({ orderId, ...order }) => {
  loadingOrders.update(state => [...state, orderId]);
  goto("manage/orders");
  try {
    const res = await fetch(`api/order/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(order)
    });
    const data = await res.json();
    console.log(data);
    currentOrder.update(state => ({
      ...state,
      target: data.target,
      order: data.items.reduce((prev, curr) => ({ ...prev, [curr.referenceId]: (prev[curr.referenceId] | 0) + 1 }), {})
    }));
    orders.update(state => state.map(o => o._id === orderId ? data : o));
  } catch (error) {
    console.log("Failed to patch order");
    console.log(error);
  } finally {
    loadingOrders.update(state => state.filter(s => s !== orderId));
  }
};

export const postOrder = async order => {
  // will conflict in case your are posting 2 new orers at a time
  orders.update(state => [...state, order]);
  goto("manage/orders");
  try {
    const res = await fetch("api/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(order)
    });
    const data = await res.json();
    orders.update(state => [...state.filter(s => s._id), data]);
  } catch (error) {
    console.log("Failed to post order");
    console.log(error);
  } finally {
    loadingOrders.update(state => state.filter(s => s !== "new"));
  }
};

export const selectOrder = _id => {
  let order;
  orders.update(state => {
    order = state.find(o => o._id === _id);
    return state;
  })
  currentOrder.update(state => ({
    ...state,
    target: order.target,
    order: order.items.reduce((prev, curr) => ({ ...prev, [curr.referenceId]: (prev[curr.referenceId] | 0) + 1 }), {})
  }));
  goto(`manage/orders/${_id}`);
};

export const addItemsToOrder = referenceIds => currentOrder.update(state => {
  let order = { ...state };
  referenceIds.forEach(id => newState[id] = newState[id] | 0 + 1);
  return {
    ...state,
    order
  }
});

export const addItemToOrder = referenceId => currentOrder.update(state => ({
  ...state,
  order: {
    ...state.order,
    [referenceId]: (state.order[referenceId] | 0) + 1
  }
}));

export const removeItemFromOrder = referenceId => currentOrder.update(state => ({
  ...state,
  order: {
    ...state.order,
    [referenceId]: state.order[referenceId] - 1
  }
}));