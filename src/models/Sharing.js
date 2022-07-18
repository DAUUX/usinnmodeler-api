const { Model } = require('sequelize');

class Sharing extends Model {

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
            tableName: 'sharing',
            // paranoid: true
        })
        return Sharing;
    }

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: 'collaborator_id', as: 'collabprator' });
		this.belongsTo(models.Diagram, { foreignKey: 'diagram_id', as: 'diagram' });
	}

}

module.exports = Sharing;