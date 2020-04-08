<script context="module">
  import { getForm } from "./_form";

  export function preload({ params, query }) {
    const form = getForm(params.type);
    return {
      type: params.type,
      ...form,
      values: {
        ...form.values,
        email: query.email || ""
      }
    };
  }
</script>

<script>
  import auth_methods from "../../services/auth";

  import { validation } from "./_form";
  import { authError } from "../../stores/auth";

  export let type;
  export let values;
  export let touched;
  export let errors;

  $: isValid =
    Object.keys(errors).every(e => errors[e] === "") &&
    Object.keys(touched).every(t => touched[t]);

  const handleChange = ({ target: { name, value, type, checked } }) => {
    if (type === "checkbox") {
      values[name] = checked;
    } else {
      values[name] = value;
    }

    if (!touched[name]) {
      touched[name] = true;
    }

    validateForm();
  };

  // add submit flag to check for non touched to be not affected by validation
  const validateForm = () => {
    const fields = document.forms["auth_form"].getElementsByTagName("input");
    for (let { name, type, value, checked } of fields) {
      if (type !== "checkbox" && values[name] !== value) {
        values[name] = value;
      }
      validation[name](type === "checkbox" ? checked : value, errors, values);
    }
  };

  const handleSubmit = e => {
    validateForm();
    auth_methods[type](values);
  };
</script>

<style>
  * {
    color: white;
    /* font-family: Cabin, sans-serif; */
  }
  form {
    padding: 2em;
    width: 100%;
    gap: 5px;
    align-self: start;
  }
  h2 {
    justify-self: center;
    padding: 0 1em;
    position: relative;
    transform: translateY(-20px);
    width: 100%;
    text-align: center;
  }
  h2::after,
  h2::before {
    content: "";
    width: calc(50% - 40px - 2em);
    height: 1px;
    background-color: white;
    position: absolute;
    top: 50%;
    box-shadow: var(--shadow-text-m);
  }

  h2::after {
    left: 1em;
  }
  h2::before {
    right: 1em;
  }
  input {
    background-color: var(--cl-black-opace);
    padding: 1em 0.5em;
    font-family: "Cabin", Helvetica, Arial, sans-serif;
    font-size: 1.7em;
    box-shadow: var(--shadow-m);
  }
  input::placeholder {
    line-height: normal;
    color: var(--cl-selected);
    /* transform: translateY(5px); */
  }
  form,
  div {
    max-width: 400px;
    justify-self: center;
  }
  div {
    display: grid;
    place-items: center;
    gap: 5px;
  }
  button {
    background-color: var(--cl-black-opace);
    font-size: 1.5em;
    text-shadow: var(--shadow-text-xl);
    padding: 0 1em;
    display: flex;
    place-items: center;
    box-shadow: var(--shadow-m);
    height: 50px;
    border: 2px solid white;
    border-radius: 25px;
    width: max-content;
    justify-self: center;
  }
  label {
    text-shadow: var(--shadow-text-m);
  }
  button > img {
    margin-right: 20px;

    text-shadow: var(--shadow-text-m);
  }
  .forgot-password {
    font-size: 90%;
    /* justify-self: end; */
    padding: 0 1em 1em 1em;
  }
  .manager {
    position: relative;
    box-shadow: none;
    justify-self: center;
    color: var(--cl-grey-dark);
    grid-column: 1 / 3;
    background-color: transparent;
    font-size: 130%;
    text-shadow: var(--shadow-text-m);
    border: none;
    display: grid;
    place-items: center;
  }
  .manager::after,
  .manager::before {
    content: "";
    width: 40px;
    height: 1px;
    background-color: white;
    position: absolute;
    top: 50%;
    box-shadow: var(--shadow-text-m);
  }

  .manager::after {
    left: -40px;
  }
  .manager::before {
    right: -40px;
  }
  .manager > label {
    font-weight: 500;
    color: white;
  }
  .redirect {
    align-self: end;
  }
</style>

<!-- type: ["register", "confirm", "login", "request_reset", "reset"] -->
<form name="auth_form" on:submit|preventDefault={handleSubmit}>
  {#if ['register', 'login', 'confirm', 'request_reset'].includes(type)}
    <h2>{type.capitalize ? type.capitalize() : type}</h2>
    <label class:invalid={errors.email !== ''}>
      <!-- Email: -->
      <input
        type="email"
        name="email"
        value={values.email}
        on:keyup={handleChange}
        placeholder="Email.." />
      <p>{errors.email}</p>
    </label>
  {/if}
  {#if ['confirm', 'reset'].includes(type)}
    <label class:invalid={errors.code !== ''}>
      <!-- Confirmation code: -->
      <input
        name="code"
        type="text"
        value={values.code}
        on:keyup={handleChange}
        placeholder="Code" />
      <p>{errors.code}</p>
    </label>
  {/if}
  {#if ['register', 'login', 'reset'].includes(type)}
    <label class:invalid={errors.password !== ''}>
      <!-- Password: -->
      <input
        name="password"
        type="password"
        placeholder="Password.."
        value={values.password}
        on:keyup={handleChange} />
      <p>{errors.password}</p>
      {#if type === 'login'}
        <a class="forgot-password" href="/auth/request_reset">
          Forgot password?
        </a>
      {/if}
    </label>
  {/if}
  {#if ['register', 'reset'].includes(type)}
    <label class:invalid={errors.password_confirm !== ''}>
      <!-- Confirm Password: -->
      <input
        name="password_confirm"
        type="password"
        placeholder="Confirm Password.."
        value={values.password_confirm}
        on:keyup={handleChange} />
      <p>{errors.password_confirm}</p>
    </label>
  {/if}
  {#if type === 'register'}
    <label class:invalid={errors.tac !== ''} class="label-checkbox">
      <input name="tac" type="checkbox" on:change={handleChange} />
      Hereby i agree to the terms and conditions.
      <p>{errors.tac}</p>
    </label>
  {/if}
  <button type="submit">
    <img src="check-w.svg" alt="submit" height="25" />
    <label>Submit</label>
  </button>
  {#if $authError !== ''}
    <p>{$authError}</p>
  {/if}
</form>
<div class="redirect">
  {#if type === 'login'}
    <a href="/auth/register">
      <button class="manager">
        <label>Register</label>
      </button>
    </a>
  {:else if type === 'register'}
    <a href="/auth/login">
      <button class="manager">
        <label>Login</label>
      </button>
    </a>
  {/if}
</div>
