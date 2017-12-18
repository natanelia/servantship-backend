import Sequelize from "sequelize";
import sequelize from "../../core/sequelize";

/**
 * EventType Schema
 */
const EventType = sequelize.define('EventType', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: false,
        },
        defaultStartedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'default_started_at',
        },
        defaultEndedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'default_ended_at',
        }
    }, {
        comment: 'Table of types of event with its defaults',
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                fields: ['name'],
            },
        ],
        underscored: true,
    });

    return EventType;
};

export default EventType;