module.exports = {
    pagination: (req) => {
        let { limit = 10, page = 0 } = req.query;

		page = page > 0 ? page - 1 : 0;

		limit = parseInt(limit);
		offset = parseInt((page) * limit);

        return {limit, offset, page};
    }
};