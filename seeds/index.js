const mongoose = require('mongoose');
const Product = require('../models/product.js');
const { title, imageUrl } = require('./seedHelpers.js');

mongoose.connect('mongodb://localhost:27017/shopping-cart')
    .then(() => {
        console.log("Database Connected");
    })
    .catch(err => {
        console.log('Connection Error');
        console.log(err);
    });

const seedDB = async () => {
    await Product.deleteMany({});
    for (let i = 0; i < title.length; i++) {
        const randomPrice = Math.floor(Math.random() * 1000) + 1;
        const product = new Product({
            title: title[i],
            price: randomPrice,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum impedit, odio distinctio modi consequuntur facilis enim. Inventore cumque, accusamus labore optio iure velit esse quidem recusandae explicabo officiis maiores nemo',
            image: imageUrl[i]
        });
        await product.save();
    }
}

seedDB().then(() => mongoose.connection.close());