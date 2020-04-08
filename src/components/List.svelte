<script>
  export let items = [];
</script>

<style>
  ul {
    display: grid;
  }

  li {
    position: relative;
    padding: 1em;
  }
  a {
    box-sizing: border-box;
    display: grid;
    gap: 10px;
    grid-template-columns: max-content 1fr;
  }
  img {
    grid-row: 1 / 3;
  }
  li::after {
    content: "";
    position: absolute;
  }
</style>

<ul class="list">
  {#each items as { id, label, description }}
    <li>
      <a href={`menu/${id}`}>
        <img src="food.svg" height="50px" alt="restaurant" />
        <h3>{label}</h3>
        <p>{description}</p>
      </a>
    </li>
  {/each}
</ul>
<!--
  This list takes an array of items with an id.

 -->
