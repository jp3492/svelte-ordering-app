import SearchQueries from '../../../database/queries/search_queries';

export const post = async ({ body: { type, name, ...coords } }, res) => {
  try {
    let items = [];
    if (type === "locate") {
      items = await SearchQueries.locateMenus(coords);
    } else {
      items = await SearchQueries.searchMenus(name);
    }
    res.status(200).send({ items });
  } catch (error) {
    res.status(400).send({ error });
  }
};