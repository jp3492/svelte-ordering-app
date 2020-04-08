import MenuQueries from '../../../../../../database/queries/menu_queries';

export const patch = async (req, res) => {
  try {
    const updatedMenu = await MenuQueries.updateSection({ ...req.body, ...req.params });
    res.status(200).send(updatedMenu);
  } catch (error) {
    res.status(400).send({ error });
  }
};

export const del = async (req, res) => {
  try {
    const updatedMenu = await MenuQueries.removeSection({ ...req.params });
    res.status(200).send(updatedMenu);
  } catch (error) {
    res.status(400).send({ error });
  }
};