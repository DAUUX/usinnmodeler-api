const { Model } = require('sequelize');

class Favorite extends Model {
    
    static init(connection) {
        super.init({}, {
            scopes: {
                byDiagram(diagram_id) {
                    return {
                        where: {diagram_id}
                    }
                }
            },
            sequelize: connection,
            tableName: 'favorite',
            // paranoid: true
        })
        return Favorite;
    }

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
		this.belongsTo(models.Diagram, { foreignKey: 'diagram_id', as: 'diagram' });
	}

}

module.exports = Favorite;