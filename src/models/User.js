const { Model, DataTypes } = require('sequelize');

class User extends Model {

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
                        args: [3, 100],
                        msg: 'O nome deve ter entre 3 e 100 caracteres'
                    },
                    is:{
                        args: /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/, 
                        msg:"O nome não deve conter caracteres especiais"
                    }   // Aceita letras, espaços e letras com acentos
                }
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Preencha o campo email'
                    },
                    notEmpty: {
                        args: true,
                        msg: 'Preencha o campo email'
                    },
                    len: {
                        args: [3, 100],
                        msg: 'O email deve ter entre 3 e 100 caracteres'
                    }
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Preencha o campo senha'
                    },
                    notEmpty: {
                        args: true,
                        msg: 'Preencha o campo senha'
                    }
                }
            },
            company: {
                type: DataTypes.STRING,
            },
            role: {
                type: DataTypes.STRING,
            },
        }, {
            sequelize: connection,
            tableName: 'user',
            paranoid: true
        })
        return User;
    }

	static associate(models) {
		this.hasMany(models.Diagram, { foreignKey: 'user_id', as: 'user'});
	}

}

module.exports = User;