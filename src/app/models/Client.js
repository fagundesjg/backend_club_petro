const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const ClientSchema = new Schema(
	{
		cpf: {
			type: Number,
			required: true,
			unique: true,
			trim: true,
		},
		clientCode: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = model('client', ClientSchema);
