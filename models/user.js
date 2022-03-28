const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    cart: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number
        }
    ]
});

UserSchema.virtual('cartQuantity').get(function () {
    let cartQuantity = 0;
    this.cart.forEach((item) => {
        cartQuantity += item.quantity;
    })
    return cartQuantity;
})

UserSchema.virtual('totalCartPrice').get(function () {
    const priceArray = this.cart.map((item) => {
        return item.product.actualPrice * item.quantity;
    })

    const totalPrice = priceArray.reduce((totalPrice, currentPrice) => {
        return totalPrice + currentPrice;
    })

    return totalPrice;
})

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);