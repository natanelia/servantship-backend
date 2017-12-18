import Sequelize from "sequelize";
import sequelize from "../../core/sequelize";

/**
 * User Schema
 */
const User = sequelize.define(
  "User",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    activationCode: {
      type: Sequelize.STRING,
      allowNull: true,
      field: "activation_code"
    }
  },
  {
    comment:
      "Table of all manageable personnel, which includes internal and external people manageable through the application.",
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ["phone"]
      },
      {
        fields: ["name"]
      }
    ],
    underscored: true
  }
);

export default User;
