<script>
  import { postMenu } from "../stores/menus";

  let loading = false;

  let values = {
    name: "",
    description: ""
  };

  const handleSubmit = () => {
    loading = true;
    postMenu(values);
  };
</script>

<style>
  form {
    height: max-content;
    align-self: center;
    /* padding: 1em; */
    min-width: 300px;
  }
  textarea {
    min-height: 80px;
  }
</style>

<h2>Create New Menu</h2>

<form on:submit|preventDefault={handleSubmit}>
  <label>
    Name
    <input
      name="name"
      type="text"
      bind:value={values.name}
      placeholder={`"Lunch menu"`} />
  </label>
  <label>
    description
    <textarea
      name="description"
      bind:value={values.description}
      placeholder={`"Everyday between 11am and 2pm."`} />
  </label>
  <button disabled={loading} type="submit">
    {loading ? 'Submitting...' : 'Create Menu'}
  </button>
</form>
