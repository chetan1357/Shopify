# Shopping Cart

![Screenshot from 2022-03-29 11-01-44](https://user-images.githubusercontent.com/91899607/160541047-e4bf28a2-1950-4e33-946a-d4a6651fda9b.png)

![Screenshot from 2022-03-29 11-04-06 (1)](https://user-images.githubusercontent.com/91899607/160541069-83a7bc69-0f4c-4c28-aa7c-eb81b12e1e57.png)

Shopify is a site where a user can buy and review a product. In order to buy or review any product you must have an account.

This project was created using Node.js, Express, Mongoose, MongoDB and Bootstrap.

Passport.js was used to handle authentication.

# Features

- Users can create an account.
- Users can also Add, Edit and Delete any product if username is "admin"
- Users can post reviews on products.
- Users can add products into a cart.
- Users can buy products and their orders are visible on MyOrders page.
- An admin can change the Order status of any user to Placed, Confirmed, Delivered, Completed.
- Users can search products by Name.
- Users can sort the products by highest rating, most reviewed, highest price or lowest price.

# Run it locally

1. Install <a href="https://www.mongodb.com/">mongodb</a>
2. Create an cloudinary account to make your API key and secret code.
3. Run the below command to install all the necessary packages.

<code>npm install</code>

Create a .env file in the root directory of your project and do the following

CLOUDINARY_CLOUD_NAME= 'name'
  
CLOUDINARY_KEY='key'
  
CLOUDINARY_SECRET='secret'

Run the <code> node app.js </code> in the terminal of project.

Then go to <a href="https://localhost:3000">localhost:3000</a>
