var mysql = require('mysql');
var inquire = require('inquirer');
var chalk = require('chalk');
var Table = require('cli-table');

var log = console.log;
var customerName = [];
var currentOrder = [];
var currentOrderQuantity = [];
var globalNewStockQuantity = [];
var currentPrice = [];
var totalPrice = [];

var table = new Table({
    head: ['Item ID', 'Product Name', 'Department', 'Price', 'Stock Quantity'],
    colWidths: [10, 40, 20, 10, 20]
});

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    log("connected as id " + connection.threadId);
    userVerify();
    
});

// this function will show the inventory after the user verification and run buyProduct();
function start() {
    log(chalk.green("Please browse our selection!\n"));
    connection.query(
        "SELECT * FROM products", function (err, res) {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {

                table.push([
                    res[i].item_id,
                    res[i].product_name,
                    res[i].department_name,
                    res[i].price,
                    res[i].stock_quantity
                ]);

            };

            log(chalk.blue(table.toString()));

            buyProduct();


        }
    );

}

// this will end the program when the user decides and logs them out
function exit() {
    log(chalk.green('Thanks for visiting Bamazon, have a great rest of your day!'));
    connection.end;
}

// password validation to ensure strong password
function passwordValidate(password) {
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return strongRegex.test(password) || "The password must be eight characters or longer, contain a lowercase letter, an uppercase letter, a number, and at least one special character";
}

// confirm new user to enter into database
function confirmNewUser() {
    inquire
        .prompt([
            {
                name: "confirm",
                type: "confirm",
                message: "Would you like to create an account with Bamazon today?",
                default: true
            }
        ]).then(function(answer) {
            if (answer.confirm) {
                inquire
                    .prompt([
                        {
                            name: "name",
                            type: "input",
                            message: "Enter your name and get ready to enjoy Bamazon!"
                        }
                    ]).then(function(answer) {
                        // takes the newly made user and updates the name by taking the last created user id and updating the name field
                        customerName.push(answer.name)
                        connection.query(
                            "UPDATE users SET ? ORDER BY user_id DESC LIMIT 1",
                            {
                                name: answer.name
                            }

                        ), function (err, res) {

                            
                            if (err) throw err;
                            
                        };
                        start();
                    });
                    

            }
        });
};


// this will run and create a user account or otherwise log user in
function userVerify() {
    inquire
        .prompt([
            {
                name: "username",
                type: "input",
                message: "Please enter your username if you have one or create a new one!",

            },
            {
                name: "password",
                type: "password",
                message: "Please enter your password or create one!",
                mask: "*",
                validate: passwordValidate
            }
        ]).then(function (answer) {
            log(answer.username);
            connection.query(
                "SELECT * FROM users", function (err, res) {
                    if (err) throw err;
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].username === answer.username && res[i].password === answer.password) {
                            connection.query(
                                "SELECT name FROM users WHERE username = ?",
                                [
                                    answer.username
                                ],
                                function (err, res) {
                                    // log(res);
                                    if (err) throw err;
                                    for (let i = 0; i < res.length; i++) {
                                        log(chalk.blue("\nWelcome back " + res[i].name));
                                        customerName.push(res[0].name)
                                        start();
                                    }
                                }

                            );
                        } else if (res[i].username !== answer.username && res[i].password === answer.password) {
                            log(chalk.bgRed("\nIncorrect username, please try again..."));
                            userVerify();

                        } else if (res[i].username === answer.username && res[i].password !== answer.password) {
                            log(chalk.bgRed("\nIncorrect password, please try again..."));
                            userVerify();

                        } else if (res[i].username !== answer.username && res[i].password !== answer.password) {
                            connection.query(
                                "INSERT INTO users SET ?",
                                {
                                    username: answer.username,
                                    password: answer.password
                                }
                            ), function (err) {
                                if (err) throw err;
                                
                            };
                            return confirmNewUser();
                            
                        } else {
                            exit();
                        }
                    }
                }
            )
        })
};

function buyProduct() {
    
    inquire 
    // prompt user to buy the product
        .prompt([
            {
                name:"buy",
                type:"input",
                message: "Which product would you like to purchase? Please select its ID",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                  }

            },
            {
                name:"order",
                type:"input",
                message: "How many of the selected items do you wish to buy?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                  }
            }
        ]).then(function(answer){

            // find the item_id of the product
            connection.query(
                "SELECT product_name, price FROM products WHERE ?",
                {
                    item_id: answer.buy
                }
            , function(err, res){

                if(err) throw err;

                // push the order quantity into a global variable
                currentOrderQuantity.push(answer.order);
                
                // push the product purchase response into a global variable
                currentOrder.push(res[0].product_name);

                currentPrice.push(res[0].price);

                let price = currentPrice * currentOrderQuantity;

                totalPrice.push(price);

                // log(chalk.bgRed(totalPrice));



                // inquire prompt to confirm order and show the order back to the customer

                inquire
                    .prompt([
                        {
                            name: "confirmOrder",
                            type: "confirm",
                            message: "\nis the following order correct?"
                            + chalk.green("\nItem: ") + chalk.blue(currentOrder)
                            + chalk.green("\nQuantity: ") + chalk.blue(answer.order) + "\n",
                            default: true
                        }
                    ]).then(function(answer){

                        // if the user confirms the answer then update the stock quantity

                        if (answer.confirmOrder){

                            connection.query(
                                "SELECT stock_quantity FROM products WHERE ?",
                                {
                                    product_name: currentOrder

                                }, function(err,res){

                                    if(err) throw err;

                                    // log(res[0].stock_quantity);

                                    let oldStockQuantity = res[0].stock_quantity;

                                    // log(chalk.red(oldStockQuantity));

                                    let localNewStockQuantity = oldStockQuantity - currentOrderQuantity;

                                    globalNewStockQuantity.push(localNewStockQuantity);

                                    updateStock();


                                    
                                }
                            );

                            // asynchronously run function to display to customer their purchase and price
                            showFinalOrder();

                        };
                
                    })
                
            })
        })
        
}

// function to update the table with the new stock after the purchase by the customer
function updateStock() {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                product_name: currentOrder
            },
            {
                stock_quantity: currentOrderQuantity
            }
        ]
    )
}

// function to display the final order and price to the customer and ask for another purchase or exit program
function showFinalOrder() {
    inquire
        .prompt([
            {
                name: "finalOrder",
                type: "list",
                message: chalk.bgGreen(
                    "\nCongratulations on your purchase " + chalk.blue(customerName) + "!") +"\nYour total comes out to: " + chalk.green(totalPrice) + chalk.bgGreen("\nWould you like to make another purchase or log out?\n"),
                choices: ["Make another purchase", "Log Out"]
            }
        ]).then(function(answer){
            currentOrder.length = 0;
            currentOrderQuantity.length = 0;
            globalNewStockQuantity.length = 0;
            currentPrice.length = 0;
            switch (answer.finalOrder){
                case "Make another purchase":

                    totalPrice.length = 0;
                    start();
                    
                    break;
                
                case "Log Out":
                    customerName.length = 0;
                    exit();
                    
                    break;
                    
                default:
                   log("There's been some sort of error! We apologize sincerely. Please reload our app and try again")



            
            }
        })
}

