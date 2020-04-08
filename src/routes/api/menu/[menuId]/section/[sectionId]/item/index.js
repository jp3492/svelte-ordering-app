import MenuQueries from '../../../../../../../database/queries/menu_queries';

export const post = async (req, res) => {
  try {
    const updatedMenu = await MenuQueries.addItem({ ...req.body, ...req.params });
    res.status(200).send(updatedMenu);
  } catch (error) {
    res.status(400).send({ error });
  }
};

export const patch = async (req, res) => {
  try {
    const updatedMenu = await MenuQueries.sortItems({ ...req.body, ...req.params });
    res.status(200).send(updatedMenu);
  } catch (error) {
    res.status(400).send({ error });
  }
};