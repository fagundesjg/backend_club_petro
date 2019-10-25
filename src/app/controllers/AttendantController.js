const Attendant = require('../models/Attendant');

module.exports = {
	async store(req, res) {
		const { cpf, attendantCode } = req.body;
		const attendant = await Attendant.findOne({ attendantCode, cpf });

		if (!attendant) {
			const newAttendant = await Attendant.create({ cpf, attendantCode });
			return res.json(newAttendant);
		}

		return res.json({
			error: true,
			message: 'Error. Duplicate entry for this attendant code or CPF.',
		});
	},

	async index(req, res) {
		const attendants = await Attendant.find({});
		return res.json(attendants);
	},
};
