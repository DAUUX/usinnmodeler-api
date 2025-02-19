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
                    isEmail: {
                        args:true,
                        msg: 'O email deve ser um email válido'
                    },
                    notNull: {
                        msg: 'Preencha o campo email'
                    },
                    notEmpty: {
                        args: true,
                        msg: 'Preencha o campo email'
                    },
                    len: {
                        args: [1, 255],
                        msg: 'O email deve ter menos de 255 caracteres'
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
            birthday: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Preencha o campo data de nascimento'
                    },
                    notEmpty: {
                        args: true,
                        msg: 'Preencha o campo data de nascimento'
                    }
                }
            },
            gender: {
                type: DataTypes.INTEGER(1),
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Preencha o campo gênero'
                    },
                    min:1,
                    max:3
                }
            },
            company: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Preencha o campo organização'
                    },
                    notEmpty: {
                        args: true,
                        msg: 'Preencha o campo organização'
                    }
                }
            },
            role: {
                type: DataTypes.INTEGER(1),
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Preencha o campo perfil'
                    },
                    min:1,
                    max:3
                }
            },
            avatar: {
                type: DataTypes.INTEGER(1),
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Preencha o campo avatar'
                    },
                    min:1,
                    max:4
                }
            },
            preferences: {
                type: DataTypes.JSON, // Define o tipo como JSON para armazenar o dicionário
                allowNull: true, // Permite valores nulos
                validate: {
                    isValidJson(value) {
                        if (value !== null && typeof value !== 'object') {
                            throw new Error('As preferências devem ser um objeto JSON válido.');
                        }
                    }
                },
                defaultValue: {} // Define o valor padrão como um objeto vazio
            }
        }, {
            sequelize: connection,
            tableName: 'user',
            paranoid: false
        })
        return User;
    }

	static associate(models) {
		this.hasMany(models.Diagram, { foreignKey: 'user_id', as: 'user'});
        this.hasMany(models.Notification, { foreignKey: 'user_id', as: 'notification'});
	}

}

module.exports = User;