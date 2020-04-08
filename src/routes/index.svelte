<style>
  main {
    margin: 0 auto;
    width: 100%;
    max-width: 1024px;
    min-height: 100vh;
    display: grid;
    grid-auto-rows: max-content;
    overflow: hidden;
    row-gap: 2em;
  }
  main::before {
    content: "";
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    height: 100%;
    background: linear-gradient(to right, #283048, #859398);
  }
  * {
    color: white;
  }

  section img,
  .top-images > img {
    box-shadow: var(--shadow-m);
    height: 500px;
  }

  header {
    height: 150px;
    border: none;
    grid-template-columns: 1fr max-content;
  }
  header::after {
    content: "";
    position: absolute;
    width: 100%;
    left: 0;
    top: 150px;
    bottom: 0;
    background-color: var(--cl-grey);
    height: 1px;
  }
  header > h1 {
    font-size: 300%;
  }
  header > a {
    display: grid;
    place-items: center;
    grid-column: 2 / 3;
    grid-row: 1 / 3;
    padding: 0 2em;
  }
  header > a > img {
    box-shadow: none;
  }
  .top {
    display: grid;
    grid-template-columns: 1fr max-content;
    column-gap: 150px;
    row-gap: 50px;
    padding: 0 1em 3em 1em;
  }
  .top-text {
    display: grid;
    grid-template-rows: max-content max-content max-content 1fr;
    row-gap: 20px;
  }
  .top-text > h2 {
    padding-top: 1em;
  }
  .top-text > a {
    padding: 1em;
    margin: 2em 0;
    background-color: white;
    box-shadow: var(--shadow-m);
    width: max-content;
    color: black;
  }
  .arrow-down {
    align-self: end;
    display: grid;
    grid-template-columns: 1fr max-content;
    gap: 20px;
    padding-bottom: 1em;
  }
  .arrow-down > img {
    transform: scale(1, -1) rotate(90deg) translateX(-25px);
    box-shadow: none;
  }
  .top-images {
    position: relative;
    width: 300px;
  }
  .top-images > .search {
    position: absolute;
  }
  .search {
    transform: translateX(-100px);
  }
  .order {
    transform: translateY(50px);
  }
  .sections-header {
    display: grid;
    row-gap: 10px;
    padding: 1em;
    padding-top: 3em;
  }
  .sections-header > p {
    max-width: 550px;
  }
  .sections {
    display: grid;
    justify-content: center;
    align-content: center;
    gap: 40px;
    padding: 1em;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
  section {
    display: grid;
    gap: 20px;
    row-gap: 30px;
  }

  .section-text {
    display: grid;
    gap: 10px;
  }
  .section-text > p {
    border-left: 2px solid white;
    padding-left: 10px;
  }
  .section-image {
    align-self: end;
    display: grid;
    justify-content: center;
  }

  @media only screen and (max-width: 768px) {
    header {
      height: 100px;
    }
    header::after {
      top: 100px;
    }
    section img,
    .top-images > img {
      height: 400px;
    }
    .top {
      grid-template-columns: 1fr;
    }
    .top-text {
      row-gap: 10px;
    }
    .top-text > h2 {
      padding-top: 0;
    }
    .top-images {
      position: relative;
      place-items: center;
      display: grid;
      transform: translateX(50px);
      width: inherit;
    }
  }
</style>

<svelte:head>
  <title>Ordering App</title>
</svelte:head>
<main>
  <header>
    <h1>Flipper</h1>
    <p>Contactless ordering and restaurant management.</p>
    <a href="manage">
      <img src="user-w.svg" alt="profile" height="30px" />
    </a>
  </header>
  <div class="top">
    <div class="top-text">
      <h2>Find your favorite place and simply order on your own phone.</h2>
      <p>
        Flipper is a Web App for easy Menu and Order management. Find menus in
        your area and browse through dishes and whatsoever. With Flipper you can
        make an order at any time on your own device. Your order will be taken
        by scanning a QRCode.
      </p>
      <a href="search">Start searching now</a>
      <p class="arrow-down">
        Interested in using Flipper professionally? Scroll down and get further
        information.
        <img src="arrow-round-w.svg" height="40" alt="more information" />
      </p>
    </div>
    <div class="top-images">
      <img class="search" src="search.png" alt="search view" />
      <img class="order" src="order.png" alt="order view" />
    </div>
  </div>
  <div class="sections-header">
    <h2>Want to upload your own menus?</h2>
    <p>
      We provide a simple UI for managing menus and orders, as well as actively
      taking orders from your customers.
      <br />
      <br />
      Check it out below.
    </p>
  </div>
  <div class="sections">
    <section>
      <div class="section-text">
        <h3>1. Create a Menus</h3>
        <p>
          You can create and switch between menus one or multiple at the same
          time.
          <br />
          Multiple active menus will be combined into one menu for the user.
        </p>
      </div>
      <div class="section-image">
        <img src="menus.png" alt="menus" />
      </div>
    </section>

    <section>
      <div class="section-text">
        <h3>2. Add Sections and Items</h3>
        <p>
          Structure your menu with multiple sections and Items and add Details
          as well as Price.
          <br />
          You can edit your menu at any time and stay flexible.
        </p>
      </div>
      <div class="section-image">
        <img src="menu.png" alt="menu" />
      </div>
    </section>

    <section>
      <div class="section-text">
        <h3>3. Take Orders from Customers</h3>
        <p>
          Your customers can scan your menu via QR-Code and place their orders
          on their own device.
          <br />
          Every order creates a QR-Code that can be scanned by you or your
          Waiter.
        </p>
      </div>
      <div class="section-image">
        <img src="take-order.png" alt="manage" />
      </div>
    </section>
  </div>
  <footer />
</main>
