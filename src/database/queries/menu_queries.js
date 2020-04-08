import Menu from '../models/menu_model';
import User from "../models/user_model";

const getMenus = async ({ userId }) => {
  try {
    const menus = await Menu.find({ userId });
    console.log("Got menus successfully.");
    return menus;
  } catch (error) {
    console.log(error);
    console.log("Failed to get menus.");
    return error;
  }
};

const createMenu = async props => {
  try {
    console.log(props);

    const newMenu = new Menu(props);
    await newMenu.save();
    console.log("New Menu created successfully!");
    return newMenu;
  } catch (error) {
    console.log(error);
    console.log("Failed to create new Menu");
    return error;
  }
};

const getMenu = async ({ menuId }) => {
  try {
    const menu = await Menu.findOne({ _id: menuId });
    console.log(menu);

    console.log("Got menu successfully.");
    return menu;
  } catch (error) {
    console.log(error);
    console.log("Failed to get menu.");
    return error;
  }
};

const getMenuByUser = async ({ userId }) => {
  try {
    const user = await User.findOne({ _id: userId });
    // TODO: when menu availability is available filter for that in the query
    const menus = await Menu.find({
      userId
    });
    // return user information to display restaurant name and desc
    const mergedSections = menus.reduce((prev, curr) => [...prev, ...curr.sections], []).sort((a, b) => b.rank - b.rank);
    return { sections: mergedSections, information: user._doc };
  } catch (error) {
    console.log("Failed to get menu by user.");
    console.log({ error });
  }
};

const updateMenu = async ({ menuId, ...values }) => {
  try {
    const updatedMenu = await Menu.findOneAndUpdate({
      _id: menuId
    }, {
      ...values
    }, { new: true });
    console.log("Menu updated successfully!");
    return updatedMenu;
  } catch (error) {
    console.log(error);
    console.log("Failed to update Menu");
    return error;
  }
};

const activateMenu = async ({ menuId, active }) => {
  try {
    console.log("MENUD ID", menuId);
    console.log("ACTIVE:", active);
    const updatedMenu = await Menu.findOneAndUpdate({
      _id: menuId,
    }, {
      $set: {
        active
      }
    }, { new: true });
    console.log(updatedMenu);

    console.log("Menu activated/inactivated successfully!");
    return updatedMenu;
  } catch (error) {
    console.log(error);
    console.log("Failed to activated/inactivated Menu");
    return error;
  }
}

const removeMenu = async ({ menuId }) => {
  try {
    await Menu.remove({ _id: menuId });
    console.log("Menu removed successfully.");
    return _id;
  } catch (error) {
    console.log(error);
    console.log("Failed to remove Menu.");
    return error;
  }
};

const addSection = async ({ menuId, ...section }) => {
  try {
    const updatedMenu = await Menu.findOneAndUpdate({
      _id: menuId
    }, {
      $push: {
        sections: section
      }
    }, { new: true });
    console.log("Section added to Menu successfully.");
    return updatedMenu;
  } catch (error) {
    console.log(error);
    console.log("Failed to add Section to Menu.");
    return error;
  }
};

const updateSection = async ({ menuId, sectionId, ...updatedSection }) => {
  try {
    console.log("RECEIVING SECTION ID", sectionId);
    console.log("RECEIVED UPDATED SECTION", updatedSection);

    const updatedMenu = await Menu.findOneAndUpdate({
      _id: menuId,
      "sections._id": sectionId
    }, {
      $set: {
        "sections.$": updatedSection
      }
    }, { new: true });
    console.log("UPDATED MENU", updatedMenu);

    console.log("Section updated successfully.");
    return updatedMenu;
  } catch (error) {
    console.log(error);
    console.log("Failed to update Section.");
    return error;
  }
};

const removeSection = async ({ menuId, sectionId }) => {
  try {
    const updatedMenu = await Menu.findOneAndUpdate({
      _id: menuId
    }, {
      $pull: {
        sections: {
          _id: sectionId
        }
      }
    }, { new: true });
    console.log("Section removed successfully.");
    return updatedMenu;
  } catch (error) {
    console.log(error);
    console.log("Failed to remove Section.");
    return error;
  }
};

const sortSections = async ({ menuId, sections }) => {
  try {
    const updatedMenu = await Menu.findOneAndUpdate({
      _id: menuId
    }, {
      sections
    });
    console.log("Sorted Sections successfully.");
    return updatedMenu;
  } catch (error) {
    console.lor({ error });
    console.log("Failed to sort Sections.");
    return error;
  }
};

// TODO: split the queries into menu_queries, section_queries
export default {
  getMenus,
  createMenu,
  getMenu,
  getMenuByUser,
  updateMenu,
  activateMenu,
  removeMenu,
  addSection,
  updateSection,
  removeSection,
  sortSections
};