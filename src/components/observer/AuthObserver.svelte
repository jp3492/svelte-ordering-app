<script>
  import { onMount, beforeUpdate } from "svelte";
  import firebase from "firebase/app";
  import { goto } from "@sapper/app";
  import { stores } from "@sapper/app";
  import "firebase/auth";

  import { isAuthenticated } from "../../stores/auth";

  // will be used for redirect on not authenticated user for this route/segment
  export let segment;

  const { session } = stores();

  isAuthenticated.set($session.user !== null);

  const authenticated_routes = ["manage"];

  beforeUpdate(() => {
    if (authenticated_routes.includes(segment) && !$isAuthenticated) {
      goto("/auth/login");
    }
  });

  onMount(() => {
    console.log(firebase);

    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        user.getIdToken().then(async idToken => {
          sendTokenToServer(idToken, "someCsrfToken");
          isAuthenticated.update(value => true);
          session.update(currentStore => ({ ...currentStore, user: user.uid }));
        });
      } else {
        isAuthenticated.update(value => false);
        session.update(currentStore => ({ ...currentStore, user: null }));
        clearCookiesOnServer("someCsrfToken");
        if (authenticated_routes.includes(segment)) {
          goto("/auth/login");
        }
      }
    });
  });

  const clearCookiesOnServer = async csrfToken => {
    const rawResponse = await fetch("/api/clear_session", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ csrfToken: csrfToken })
    });
  };

  const sendTokenToServer = async (idToken, csrfToken) => {
    const rawResponse = await fetch("/auth/session", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idToken: idToken, csrfToken: csrfToken })
    });
  };
</script>
