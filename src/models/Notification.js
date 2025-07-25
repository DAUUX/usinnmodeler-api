const { Model, DataTypes } = require('sequelize');

class Notification extends Model {

    static init(connection) {
        super.init({
            diagram_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                validate:{
                    notEmpty: {
                        args: true,
                        msg: 'Coloque o id do diagrama'
                    }
                }
            },
            diagram_name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: 'Preencha o nome do diagrama'
                    }
                }
            },
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
            message_key: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                    args: true,
                    msg: 'Preencha a chave da mensagem'
                    }
                }
            },
                message_variables: {
                type: DataTypes.JSON,
                allowNull: false,
                validate: {
                    notEmpty: {
                    args: true,
                    msg: 'Preencha os dados da mensagem'
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
	}

}

module.exports = Notification;