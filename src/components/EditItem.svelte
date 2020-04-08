<script>
  export let submit;

  let loading = false;

  let values = {
    name: $$props.name,
    description: $$props.description,
    price: $$props.price,
    sectionId: $$props.sectionId
  };

  const handleSubmit = () => submit(values);
</script>

<style>
  form {
    min-width: 320px;
  }
</style>

<h2>Edit Item</h2>

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
  <label>
    Price
    <input
      type="number"
      step="0.01"
      bind:value={values.price}
      name="price"
      placeholder={`"3.49"`} />
  </label>
  <button disabled={loading} type="submit">
    {loading ? 'Submitting...' : 'Add Item'}
  </button>
</form>
