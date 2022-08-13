const { Model } = require('sequelize');

class Collaboration extends Model {
    
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
            tableName: 'collaboration',
            // paranoid: true
        })
        return Collaboration;
    }

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: 'collaborator_id', as: 'collaborator' });
		this.belongsTo(models.Diagram, { foreignKey: 'diagram_id', as: 'diagram' });
	}

}

module.exports = Collaboration;