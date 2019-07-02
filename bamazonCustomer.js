var mysql = require('mysql');
var inquire = require('inquirer');
var chalk = require('chalk');
var Table = require('cli-table');
var log = console.log;

var table = new Table({
    head: ['TH 1 label', 'TH 2 label'],
    colWidths: [100, 200]
})

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
    start();
});

// this function will hold the other functions to run the program
function start() {
    log(chalk.green('Welcome, please browse our selection!\n'));
    connection.query(
        "SELECT * FROM products", function(err, res) {
            if (err) throw err;
            for (i = 0; i < res.length; i++) {
                table.push(res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity);
                log(chalk.bgBlue(table));
            }
        }
    );
    userVerify();
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
                return true;
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
                                "SELECT name WHERE username = ?",
                                [
                                    answer.username
                                ],
                                function (err, res) {
                                    if (err) throw err;
                                    log(chalk.green("\nWelcome back, " + res.name + "!"));
                                }
                            );
                            buyProduct();

                        } else if (res[i].username = !answer.username && res[i].password === answer.password) {
                            log(chalk.bgRed("\nIncorrect username, please try again..."));
                            userVerify();

                        } else if (res[i].password = !answer.password) {
                            log(chalk.bgRed("\nIncorrect password, please try again..."));
                            userVerify();

                        } else {
                            confirmNewUser();
                            if (confirmNewUser) {
                                connection.query(
                                    "INSERT INTO user SET ?",
                                    {
                                        username: answer.username,
                                        password: answer.password
                                    }
                                ), function (err) {
                                    if (err) throw err;
                                }
                            };
                            inquire
                                .prompt([
                                    {
                                        name: "name",
                                        type: "input",
                                        message: "Please enter your name! and welcome to Bamazon!"
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
                }
            )
        })
};

