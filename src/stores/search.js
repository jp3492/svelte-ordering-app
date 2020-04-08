import { writable } from "svelte/store";

export const search = writable("");
export const result = writable([]);

let timeout;

search.subscribe(state => {
  clearTimeout(timeout);
  if (state !== "") {
    timeout = setTimeout(() => {
      searchByName(state);
    }, 300);
  }
});

export const searchByName = async name => {
  try {
    const res = await fetch("api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: "name",
        name
      })
    });
    const { items } = await res.json();
    result.update(() => items);
  } catch (error) {
    console.log("Failed to search by name");
    console.log({ error });
  }
};

export const locate = () => {
  try {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async position => {
        const coords = {
          longitude: position.coords.longitude.toFixed(6),
          latitude: position.coords.latitude.toFixed(6)
        };
        const res = await fetch("api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ ...coords, type: "locate" })
        });
        const { items } = await res.json();
        result.update(() => items);
      });
    }
  } catch (error) {
    console.log("Failed to locate");
    console.log({ error });
  }
};