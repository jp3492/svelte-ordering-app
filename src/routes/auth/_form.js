export const getForm = type => {
  switch (type) {
    case "register":
      return {
        values: {
          email: "",
          password: "",
          password_confirm: "",
          tac: false
        },
        touched: {
          email: false,
          password: false,
          password_confirm: false,
          tac: false
        },
        errors: {
          email: "",
          password: "",
          password_confirm: "",
          tac: ""
        }
      };
    case "confirm":
      return {
        values: { email: "", code: "" },
        touched: { email: false, code: false },
        errors: { email: "", code: "" }
      };
    case "reset":
      return {
        values: { code: "", password: "", password_confirm: "" },
        touched: { code: false, password: false, password_confirm: false },
        errors: { code: "", password: "", password_confirm: "" }
      };
    case "request_reset":
      return {
        values: { email: "" },
        touched: { email: false },
        errors: { email: "" }
      };
    default:
      return {
        values: { email: "", password: "" },
        touched: { email: false, password: false },
        errors: { email: "", password: "" }
      };
  }
}

export const validation = {
  email: (value, errors, values) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(value)) {
      return (errors.email = "");
    }
    return (errors.email = "Invalid email format!");
  },
  code: (value, errors, values) => {
    if (value.length === 6) {
      return (errors.code = "");
    }
    return (errors.code = "Code must be 6 characters long!");
  },
  password: (value, errors, values) => {
    // const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    // if (re.test(value)) {
    return (errors.password = "");
    // }
    // return (errors.password =
    //   "8 characters long");
  },
  password_confirm: (value, errors, values) => {
    if (value === values.password) {
      return (errors.password_confirm = "");
    }
    return (errors.password_confirm = "Passwords do not match!");
  },
  tac: (value, errors, values) => {
    if (value) {
      return (errors.tac = "");
    }
    return (errors.tac = "You must agree to the TAC!");
  }
};