import Order from '../models/order_model';

const createOrder = async values => {
  try {
    const newOrder = new Order(values);
    await newOrder.save();
    console.log("Created Order successfully.");
    return newOrder;
  } catch (error) {
    console.log(error);
    console.log("Failed to create order.");
    return error;
  }
};

const getOrders = async ({ userId }) => {
  try {
    const orders = await Order.find({ userId });
    console.log("Got orders successfully.");
    return orders;
  } catch (error) {
    console.log(error);
    console.log("Failed to get orders.");
    return error;
  }
};

const updateOrder = async ({ orderId, ...updatedOrder }) => {
  try {
    const order = await Order.findOneAndUpdate({ _id: orderId }, { $set: updatedOrder }, { new: true });
    console.log("Updated order successfully.");
    return order;
  } catch (error) {
    console.log(error);
    console.log("Failed to update order.");
    return error;
  }
};

export default {
  createOrder,
  updateOrder,
  getOrders
};