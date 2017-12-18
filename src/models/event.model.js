import Sequelize from "sequelize";
import sequelize from "../../core/sequelize";

/**
 * Event Schema
 */
const Event = sequelize.define(
  "Event",
  {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    startedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      field: "started_at"
    },
    endedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      field: "ended_at"
    }
  },
  {
    comment: "Table of all events scheduled in the application.",
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ["title"]
      }
    ],
    underscored: true
  }
);

export default EventModel;