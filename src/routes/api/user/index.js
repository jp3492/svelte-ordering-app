import UserQueries from '../../../database/queries/user_queries';

export const get = async (req, res) => {
  try {
    const user = await UserQueries.getUser(req.user);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error });
  }
};

export const post = async (req, res) => {
  try {
    const user = await UserQueries.createUser(req.body);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error });
  }
};

export const patch = async (req, res) => {
  try {
    const user = await UserQueries.patchUser({ ...req.body, _id: req.user });
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error });
  }
};