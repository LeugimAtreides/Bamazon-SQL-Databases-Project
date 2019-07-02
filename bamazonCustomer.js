var mysql = require('mysql');
var inquire = require('inquirer');
var chalk = require('chalk');
var Table = require('cli-table');
var log = console.log;

var table = new Table({
    head: ['Item ID', 'Product Name', 'Department', 'Price', 'Stock Quantity'],
    colWidths: [10, 20, 20, 10, 20]
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
        ]).then(function (answer) {
            if (answer.confirm) {

                connection.query(
                    "INSERT INTO users SET ?",
                    {
                        username: answer.username,
                        password: answer.password
                    }
                ), function (err) {
                    if (err) throw err;
                    inquire
                        .prompt([
                            {
                                name: "name",
                                type: "input",
                                message: "Enter your name and get ready to enjoy Bamazon!"
                            }
                        ]).then(function (answer) {
                            connection.query(
                                "UPDATE users SET name = ? WHERE user_id = (SELECT MAX(user_id) FROM users)",
                                {
                                    name: answer.name
                                }

                            ), function(err) {

                                if (err) throw err;
                                buyProduct();
                            }
                        })
                }

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

                        } else {
                            confirmNewUser(answer);
                        }
                    }
                }
            )
        })
};

function buyProduct() {
    log(chalk.bgCyan("\nCOMING SOON"))
}