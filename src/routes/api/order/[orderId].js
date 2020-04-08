import OrderQueries from '../../../database/queries/order_queries';

export const patch = async (req, res) => {
  try {
    const order = await OrderQueries.updateOrder({
      userId: req.user,
      ...req.params,
      ...req.body
    });
    res.status(200).send(order);
  } catch (error) {
    res.status(400).send({
      error
    });
  }
};