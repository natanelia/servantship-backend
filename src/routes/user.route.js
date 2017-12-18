import express from "express";
import validate from "express-validation";
import Joi from "joi";
import userCtrl from "../controllers/user.controller";

const router = express.Router(); // eslint-disable-line new-cap

router
  .route("/")

  /** GET /api/users - Get list of users */
  .get(userCtrl.list)

  /** POST /api/users - Create new user */
  .post(
    validate({
      body: {
        phone: Joi.string().required(),
        name: Joi.string().required()
      }
    }),
    userCtrl.create
  );

router
  .route("/:userId")

  /** GET /api/users/:userId - Get user */
  .get(
    validate({
      params: {
        userId: Joi.string()
          .guid()
          .required()
      }
    }),
    userCtrl.get
  )

  /** PUT /api/users/:userId - Update user */
  .put(
    validate({
      body: {
        phone: Joi.string().required()
      }
    }),
    userCtrl.update
  )

  /** DELETE /api/users/:userId - Delete user */
  .delete(userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param("userId", validate({params: {userId: Joi.string().guid().required()}}));
router.param("userId", userCtrl.load);

export default router;
