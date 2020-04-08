import MenuQueries from '../../../../database/queries/menu_queries';

export const get = async (req, res) => {
  try {
    const menu = await MenuQueries.getMenu(req.params);
    res.status(200).send(menu);
  } catch (error) {
    res.status(400).send({ error });
  }
};

export const patch = async (req, res) => {
  try {
    const updatedMenu = await MenuQueries.updateMenu({ ...req.body, ...req.params });
    res.status(200).send(updatedMenu);
  } catch (error) {
    res.status(400).send({ error });
  }
};

export const del = async (req, res) => {
  try {
    await MenuQueries.removeMenu(req.params);
    res.status(200).send(req.body);
  } catch (error) {
    res.status(400).send({ error });
  }
};

export const post = async (req, res) => {
  try {
    const updatedMenu = await MenuQueries.activateMenu({ ...req.params, ...req.body });
    res.status(200).send(updatedMenu);
  } catch (error) {
    res.status(400).send({ error });
  }
};
