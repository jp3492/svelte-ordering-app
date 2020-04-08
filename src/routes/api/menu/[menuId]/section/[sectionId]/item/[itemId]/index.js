import MenuQueries from '../../../../../../../../database/queries/menu_queries';

export const patch = async (req, res) => {
  try {
    const updatedItem = await MenuQueries.updateItem({ ...req.body, ...req.params });
    res.status(200).send(updatedItem);
  } catch (error) {
    res.status(400).send({ error });
  }
};

export const del = async (req, res) => {
  try {
    const updatedItem = await MenuQueries.removeItem({ ...req.body, ...req.params });
    res.status(200).send(updatedItem);
  } catch (error) {
    res.status(400).send({ error });
  }
};