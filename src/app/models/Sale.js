const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const Client = require('./Client');

const SaleSchema = new Schema(
	{
		price: {
			type: mongoose.Types.Decimal128,
			required: true,
		},
		clientCode: {
			type: String,
			required: true,
			trim: true,
		},
		attendantCode: {
			type: String,
			required: true,
			trim: true,
		},
		client: {
			type: Schema.Types.ObjectId,
			ref: Client,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = model('sale', SaleSchema);
