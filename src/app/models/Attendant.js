const { Schema, model } = require('mongoose');

const AttendantSchema = new Schema(
	{
		cpf: {
			type: Number,
			required: true,
			unique: true,
			trim: true,
		},
		attendantCode: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
	},
	{ timestamps: true }
);

module.exports = model('attendant', AttendantSchema);
