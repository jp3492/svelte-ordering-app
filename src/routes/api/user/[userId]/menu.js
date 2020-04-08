import MenuQueries from '../../../../database/queries/menu_queries';

export const get = async (req, res) => {
  try {
    const menu = await MenuQueries.getMenuByUser(req.params);
    res.status(200).send(menu);
  } catch (error) {
    res.status(400).send({ error });
  }
};