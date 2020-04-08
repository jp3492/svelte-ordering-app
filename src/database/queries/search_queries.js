// import cheapRuler from "cheap-ruler";

import User from '../models/user_model';
import Menu from '../models/menu_model';

// const ruler = cheapRuler(35.05, 'meters');

String.prototype.formatCoord = function () {
  let cleaned = this.split("-").join("");
  // console.log({ cleaned });
  let parts = cleaned.split(".");
  // console.log({ parts });
  return parts[0] + "." + parts[1];
};

const locateMenus = async ({ longitude, latitude }) => {
  try {
    // define bounds to search for, maybe 10m ? dont know how much gps can vary on average
    // search for all items that are in bounds (small and greater than lng and lat)
    // const nw = ruler.destination([longitude, latitude], 20, 315);
    // const se = ruler.destination([longitude, latitude], 20, 135);

    const restaurants = await User.find();
    // TODO: add availability of menu and UI in frontend



    return restaurants.map((r, i) => ({ ...r._doc, distance: i }));
  } catch (error) {
    console.log("Failed to locate menus");
    console.log({ error });
    return error;
  }
}

const searchMenus = async name => {
  try {
    const users = await User.find({ $text: { $search: name } });
    console.log("Search was successfull.");
    return users;
  } catch (error) {
    console.log("Failed to search.");
    console.log(error);
    return error;
  }
};

export default {
  searchMenus,
  locateMenus
}