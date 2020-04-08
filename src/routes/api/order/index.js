import OrderQueries from '../../../database/queries/order_queries';

// BIG TODO: ADD USERID TO ALL QUERIES TO SECURE IT

export const get = async (req, res) => {
  try {
    const { items } = await OrderQueries.getOrders({ userId: req.user });
    res.status(200).send({
      items
    });
  } catch (error) {
    res.status(400).send({
      error
    })
  }
};

export const post = async (req, res) => {
  try {
    const order = await OrderQueries.createOrder({
      userId: req.user,
      ...req.body
    });
    res.status(200).send(order);
  } catch (error) {
    res.status(400).send({
      error
    });
  }
};

