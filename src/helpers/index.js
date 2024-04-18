module.exports = {
    pagination: (req) => {
        let { limit = 10, page = 0 } = req.query;

		page = page > 0 ? page - 1 : 0;

		limit = parseInt(limit);
		offset = parseInt((page) * limit);

        return {limit, offset, page};
    },

    handleExceptions: (error, res) => {

        switch(error.name) {
            case 'RequestValidationError':
                return res.status(422).json({errors: error.errors.array()});

            case "InvalidEmailError":
                const uniqueErrors = error.errors.array().filter((err, index, self) =>
                    index === self.findIndex((e) => e.msg === err.msg)
                );
                return res.status(422).json({errors: uniqueErrors});

            case 'SequelizeValidationError':
                return res.status(422).json({ errors: error.errors.map(e => ({msg: e.message})) });

            case 'JsonWebTokenError':
                return res.status(422).json({ errors: [{msg: 'Token de recuperação inválido!'}] });

            case 'TokenExpiredError':
                return res.status(422).json({ errors: [{msg: 'Link de recuperação expirado!'}] });

            default: 
                return res.status(500).json({ errors: [{msg: "Não foi possível processar esta requisição"}] });    
        }

    }
};