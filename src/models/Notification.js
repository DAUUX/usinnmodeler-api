const { Model, DataTypes } = require('sequelize');

class Notification extends Model {

    static init(connection) {
        super.init({
            type: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: 'Preencha o campo type'
                    }
                }
            },
            message: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: 'Preencha o campo msg'
                    }
                }
            },
            read: {
                type: DataTypes.TINYINT,
                allowNull: false,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: 'Preencha o campo msg'
                    }
                }
            }
        }, {
            sequelize: connection,
            tableName: 'notification',
            paranoid: false
        })
        return Notification;
    }

	static associate(models) {
	    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        this.belongsTo(models.Diagram, {foreignKey: 'diagram_id', as: 'diagram'})
	}

}

module.exports = Notification;