const { Model, DataTypes } = require('sequelize');

class RecoverToken extends Model {

    static init(connection) {
        super.init({
            token: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Token é obrigatório'
                    },
                    notEmpty: {
                        args: true,
                        msg: 'Token é obrigatório'
                    }
                }
            },
        }, {
            sequelize: connection,
            tableName: 'recover_token',
            // paranoid: true
        })
        return RecoverToken;
    }

    static associate(models) {
		this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
	}

}

module.exports = RecoverToken;