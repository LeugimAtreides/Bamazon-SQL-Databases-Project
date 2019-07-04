# Bamazon-SQL-Databases-Project

<h1>Overview</h1>
<br>
In this activity, I'll be creating an Amazon-like storefront with the MySQL skills I learned in unit 6. The app will take in orders from customers and deplete stock from the store's inventory. As a bonus task, I will attempt to program the app to track product sales across the store's departments and then provide a summary of the highest-grossing departments in the store.
<br><br><br>
<h2>Customer View<h2>
<br>
The minimum requirement for this assignment will have a connection to a mySQL database, a table inside of it called products, and the products table will have each of the following columns:

   * item_id (unique id for each product)

   * product_name (Name of product)

   * department_name

   * price (cost to customer)

   * stock_quantity (how much of the product is available in stores)

Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).

Then I will create a Node application called `bamazonCustomer.js`. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

The app should then prompt users with two messages.

   * The first should ask them the ID of the product they would like to buy.
   * The second message should ask how many units of the product they would like to buy.

Once the customer has placed the order, the application should check if the store has enough of the product to meet the customer's request.

   * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

However, if the store _does_ have enough of the product, it should fulfill the customer's order.
   * This means updating the SQL database to reflect the remaining quantity.
   * Once the update goes through, show the customer the total cost of their purchase.
<br><br><br>
<h1>VIDEO FUNCTIONALITY<h1>
<br><br>
<video src="bamazon-functionality-walkthrough.webm" type="video/webm">