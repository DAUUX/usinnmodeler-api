const { Model, DataTypes } = require('sequelize');

class Diagram extends Model {

    static init(connection) {
        super.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Preencha o campo nome'
                    },
                    notEmpty: {
                        args: true,
                        msg: 'Preencha o campo nome'
                    },
                    len: {
                        args: [3, 255],
                        msg: 'O nome deve ter entre 3 e 255 caracteres'
                    }
                }
            },
            diagram_data: {
                type: DataTypes.STRING,
                allowNull: true,
            }
        }, {
            scopes: {
                byUser(user_id) {
                    return {
                        where: {user_id}
                    }
                }
            },
            sequelize: connection,
            tableName: 'diagram',
            // paranoid: true
        })
        return Diagram;
    }

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user'});
	}

}

module.exports = Diagram;