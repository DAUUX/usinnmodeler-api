const { Model, DataTypes, Op } = require('sequelize');

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
            },
            diagram_svg: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            is_shared: {
                type: DataTypes.STRING,
                allowNull: true,
            }
        }, {
            scopes: {
                byUser(user_id) {
                    return {
                        where: {user_id}
                    }
                },
                byOwnerOrCollaborator(user_id, collaboration) {
                    return {
                        where: {
                            [Op.or]: [{user_id}, {'$collaboration.collaborator_id$': user_id}]
                        },
                        include: [
                            {model: collaboration, as: 'collaboration'}
                        ]
                    }
                }
            },
            sequelize: connection,
            tableName: 'diagram',
            paranoid: true
        })
        return Diagram;
    }

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user'});
		this.hasMany(models.Collaboration, { foreignKey: 'diagram_id', as: 'collaboration'});
        this.hasMany(models.Favorite, { foreignKey: 'diagram_id', as: 'favorite'});
	}

}

module.exports = Diagram;