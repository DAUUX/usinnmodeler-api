const { Model, DataTypes } = require('sequelize');

class Collaboration extends Model {
    
    static init(connection) {
        super.init({
            permission: {
                type: DataTypes.INTEGER(1),
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Preencha o campo de permissão'
                    },
                    min:1,
                    max:2
                }   
            },
        }, {
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