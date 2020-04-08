<script>
  export let submit;

  let loading = false;

  let values = {
    name: $$props.name,
    description: $$props.description
  };

  const handleSubmit = () => {
    loading = true;
    submit(values);
  };
</script>

<style>
  form {
    min-width: 320px;
  }
</style>

<h2>Edit Section</h2>

<form on:submit|preventDefault={handleSubmit}>
  <label>
    Name
    <input
      type="text"
      bind:value={values.name}
      name="name"
      placeholder={`"Appetizers"`} />
  </label>
  <label>
    Description
    <input
      type="text"
      bind:value={values.description}
      name="description"
      placeholder={`"Hand made deliciousness!`} />
  </label>
  <button disabled={loading} type="submit">
    {loading ? 'Submitting...' : 'Update Section'}
  </button>
</form>
