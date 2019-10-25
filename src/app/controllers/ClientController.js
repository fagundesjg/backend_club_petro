const Client = require('../models/Client');

module.exports = {
	async store(req, res) {
		const { cpf, clientCode } = req.body;
		const client = await Client.findOne({ cpf, clientCode });

		if (!client) {
			const newClient = await Client.create({ clientCode, cpf });
			return res.json(newClient);
		}

		return res.json({
			message: "Error. Already exist's a client with this cpf or client code.",
		});
	},

	async index(req, res) {
		const clients = await Client.find({});
		return res.json(clients);
	},
};
