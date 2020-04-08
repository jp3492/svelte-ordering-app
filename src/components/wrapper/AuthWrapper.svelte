<script>
  import { isAuthenticated, permissions } from "../../stores/auth";
  export let permission;

  let permitted =
    (permission === "authenticated" && $isAuthenticated) ||
    $permissions.includes(permission);
</script>

{#if permitted}
  <slot />
{/if}
