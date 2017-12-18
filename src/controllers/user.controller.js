import httpStatus from "http-status";
import generatePassword from "../util/password-generator";
import User from "../models/user.model";

const getFilteredAttributes = req => {
  const allowedFields = [
    "id",
    "phone",
    "name",
    "email",
    "created_at",
    "updated_at"
  ];
  const fields =
    req.query.field &&
    req.query.field
      .split(",")
      .map(f => f.trim())
      .filter(f => allowedFields.includes(f));
  return fields || allowedFields;
};

/**
 * Load user and append to req.
 */
const load = (req, res, next, id) => {
  User.findById(id, { attributes: getFilteredAttributes(req) })
    .then(user => {
      if (!user) {
        const e = new Error("User does not exist");
        e.status = httpStatus.NOT_FOUND;
        return next(e);
      }
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
const get = (req, res) => {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.phone - The phone number of user.
 * @property {string} req.body.name - The name of user.
 * @property {string} req.body.password - The password of user (optional, auto-generated if none).
 * @property {string} req.body.email - The password of user (optional).
 * @returns {User}
 */
const create = (req, res, next) => {
  const params = {
    phone: req.body.phone,
    name: req.body.name,
    password: req.body.password || generatePassword(),
    activationCode: generatePassword()
  };

  if (req.body.email) params.email = req.body.email;

  const user = User.build(params);

  user
    .save()
    .then(r => {
      const user = { ...r.dataValues };
      delete user.password;
      delete user.activationCode;
      res.json(user);
    })
    .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.phone - The phone of user.
 * @property {string} req.body.name - The name of user.
 * @returns {User}
 */
const update = (req, res, next) => {
  const params = {
    phone: req.body.phone,
    name: req.body.name,
    password: req.body.password || generatePassword(),
    activationCode: generatePassword()
  };

  if (req.body.email) params.email = req.body.email;

  const user = User.build(params);

  user
    .save()
    .then(r => {
      const user = { ...r.dataValues };
      delete user.password;
      delete user.activationCode;
      res.json(user);
    })
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
const list = (req, res, next) => {
  const { limit = 50 } = req.query;

  User.findAll({ attributes: getFilteredAttributes(req), limit })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
const remove = (req, res, next) => {
  const user = req.user;
  const phone = req.user.phone;
  user
    .destroy()
    .then(() => res.json(phone))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
