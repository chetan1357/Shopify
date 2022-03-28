const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

const ProductSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    discount: {
        type: Number,
        min: [0, 'discount must be greater than or equal to 0'],
        max: [100, 'discount must be less than or equal to to 100']
    },
    images: [ImageSchema],
    rateAvg: Number,
    rateCount: Number,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

ProductSchema.virtual('ratingAvg').get(function () {
    const ratingsArray = [];
    this.reviews.forEach(function (rating) {
        ratingsArray.push(rating.rating);
    });
    if (ratingsArray.length) {
        const totalRating = ratingsArray.reduce((totalRating, currentRating) => {
            return totalRating + currentRating;
        })
        const ratingAvg = totalRating / ratingsArray.length;
        return Math.round(ratingAvg);
    }
    return 0;
})

ProductSchema.virtual('ratingCount').get(function () {
    return this.reviews.length;
})

ProductSchema.virtual('actualPrice').get(function () {
    const actualPrice = Math.round(this.price - (this.price) * (this.discount / 100));
    return actualPrice;
})

ProductSchema.virtual('totalActualPrice').get(function () {
    return this;
})

module.exports = mongoose.model('Product', ProductSchema);