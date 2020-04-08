import MenuQueries from '../../../database/queries/menu_queries';

// BIG TODO: ADD USERID TO ALL QUERIES TO SECURE IT

export const get = async (req, res) => {
  try {
    const userId = req.user;
    const menus = await MenuQueries.getMenus({ userId });
    res.status(200).send({
      items: menus
    });
  } catch (error) {
    res.status(400).send({
      error
    })
  }
};

export const post = async (req, res) => {
  console.log(req.body, req.user);

  try {
    const userId = req.user;
    const menu = await MenuQueries.createMenu({
      userId,
      ...req.body
    });
    res.status(200).send(menu);
  } catch (error) {
    res.status(400).send({
      error
    });
  }
};
