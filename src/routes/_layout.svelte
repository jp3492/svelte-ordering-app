<script>
  import AuthObserver from "../components/observer/AuthObserver.svelte";
  import Modal from "../components/Modal.svelte";

  export let segment;
</script>

<AuthObserver {segment} />
<slot {segment} />
<Modal />
