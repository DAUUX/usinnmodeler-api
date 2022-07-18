const { Model, DataTypes } = require('sequelize');

class ShareToken extends Model {

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
            tableName: 'share_token',
            // paranoid: true
        })
        return ShareToken;
    }

    static associate(models) {
		this.belongsTo(models.Diagram, { foreignKey: 'diagram_id', as: 'diagram' });
	}

}

module.exports = ShareToken;