import User from '../models/user_model';
import Menu from "../models/menu_model";
import Order from "../models/order_model";

const getUser = async _id => {
  try {
    const user = await User.findById(_id);
    const menus = await Menu.find({ userId: user._id });
    const orders = await Order.find({ userId: user._id });
    return { ...user._doc, menus, orders };
  } catch (error) {
    console.log("FAILED TO GET USER FROM MONGODB");
    return error;
  }
};

const createUser = async props => {
  try {
    const newUser = new User(props);
    await newUser.save();
    console.log("New user created successfully!");
    return newUser;
  } catch (error) {
    console.log("Failed to create new User");
    console.log(error);
    return error;
  }
};

const patchUser = async ({ _id, ...props }) => {
  try {
    const updatedUser = await User.findOneAndUpdate({
      _id
    }, {
      $set: props
    }, { new: true });
    console.log("User updated successfully!");
    return updatedUser;
  } catch (error) {
    console.log("Failed to create new User");
    console.log(error);
    return error;
  }
};

export default {
  getUser,
  createUser,
  patchUser
};