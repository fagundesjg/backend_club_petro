const moment = require('moment');
const Sale = require('../models/Sale');
const Client = require('../models/Client');
const Attendant = require('../models/Attendant');

module.exports = {
	async store(req, res) {
		const { price, clientCode, attendantCode } = req.body;
		const client = await Client.findOne({ clientCode });
		const attendant = await Attendant.findOne({ attendantCode });
		/* Para economizar processamento verificamos primeiro se o cliente
		para qual deseja se realizar a venda existe. Pois caso não exista nem
		é processado mais nada. */
		if (!client) return res.json({ error: true, message: 'Error. Invalid client code.' });
		if (!attendant) return res.json({ error: true, message: 'Error. Invalid attendant code.' });
		const clientId = client._id;
		const monthStart = moment()
			.startOf('month')
			.format('YYYY-MM-DD hh:mm');
		const monthEnd = moment()
			.endOf('month')
			.format('YYYY-MM-DD hh:mm');

		/* Guarda a quantidade de vendas que o vendendor tem naquele mês */
		const totalAttendantMonthSales = await Sale.countDocuments({
			attendantCode,
			createdAt: {
				$gte: monthStart,
				$lte: monthEnd,
			},
		});

		/* Verifica se o vendedor ultrapassou o total de vendas daquele mês */
		if (totalAttendantMonthSales.length >= 20)
			return res.json({
				error: true,
				message: 'Error. The monthly maximum sales has already been reached.',
			});

		/* Guarda a quantidade total de vendas que o frentista tem */
		const attendantSales = await Sale.countDocuments({ attendantCode });

		/* Guarda a quantidade de vendas que o sistema possui */
		const totalSales = await Sale.countDocuments({});

		/* Se ao somar a proxima venda, o vendedor tiver uma quantidade menor
				ou igual a 20% do total de vendas, significa que é uma venda permitida.
				OBS:Adicionei uma condição extra de total de vendas > 5, pois no inicio o sistema tem 0 vendas,
				se nao setasse isso, essa função nunca iria funcionar */
		if (attendantSales + 1 > totalSales * 0.2)
			return res.json({
				error: true,
				message: 'Error. The seller has reached the limit of 20% of sales.',
			});

		/* Guarda a quantidade de compras que o cliente tem naquele mês */
		const totalClientMonthSales = await Sale.countDocuments({
			clientCode,
			createdAt: {
				$gte: monthStart,
				$lte: monthEnd,
			},
		});

		/* Se o cliente não tiver atingido 7 compras naquele mês, aquela é uma compra permitida */
		if (totalClientMonthSales >= 7)
			return res.json({
				error: true,
				message: 'Error. The customer has reached the limit of 7 purchases in the month.',
			});

		const totalSalesToClient = await Sale.countDocuments({
			clientCode,
			attendantCode,
		});

		/* Se o frentista ainda não tiver feito 3 vendas para o cliente, então é uma venda permitida */
		if (totalSalesToClient >= 3)
			return res.json({
				error: true,
				message: 'Error. The attendant reached the limit of 3 sales for the customer.',
			});

		await Sale.create({
			attendantCode,
			clientCode,
			price,
			client: clientId,
		});
		return res.json({ error: false, message: 'The sale was successful.' });
	},

	async index(req, res) {
		const sales = await Sale.find({});
		return res.json(sales);
	},
};
