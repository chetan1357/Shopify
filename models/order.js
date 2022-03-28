const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number
        }
    ],
    placedAt: {
        type: Date,
        default: Date.now
    },
    address: String,
    status: {
        type: String,
        default: 'Order Placed'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Order', orderSchema);