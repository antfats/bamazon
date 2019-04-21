var sql = require('mysql');
var inquirer = require("inquirer");

//Create SQL server connection
var connection = sql.createConnection({
    host: 'localhost',
    port: 3306,
    user: "root",
    password: "Tdaca12-23*",
    database: "bamazon_db"
})






//connect
connection.connect(function (err) {
    if (err) throw err;

    console.log("Connected as: " + connection.threadId);
    initialQuestion();
});

//Initial question to point us in the right direction
function initialQuestion() {
    inquirer
        .prompt({
            type: "list",
            message: "What would you like to do?",
            choices: [{ name: "View Products for Sale", value: 0 }, { name: "View Low Inventory", value: 1 }, { name: "Add to Inventory", value: 2 }, { name: "Add New Product", value: 3 }],
            name: "first"
        })
        .then(answers => {
            //Switch statement depending on they're pick
            if (answers.first === 0) {
                queryAllItems();

            }

            else if (answers.first === 1) {
                queryLowItems();

            }

            else if (answers.first === 2) {
                updateQuantity();

            }

            else if (answers.first === 3) {
                addProduct();

            }
            else { console.log("Your shits broken") }
        })
}
//function to add a product to the database
function addProduct() {
    inquirer
        .prompt([{
            type: "input",
            message: "Add a new item to inventory: ",
            name: "name"
        },
        {
            type: "input",
            message: "Enter the category",
            name: "category"
        },
        {
            type: "input",
            message: "Enter Cost",
            name: "cost"
        },
        {
            type: "input",
            message: "Enter Quantity",
            name: "quantity"
            , validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }]).then(function (answer) {
            connection.query("INSERT INTO products SET ?", {
                product_name: answer.name,
                category: answer.category,
                cost: answer.cost,
                quantity: answer.quantity
            }, function (err, res) {
                console.log("Product added");
            })
        });
    // setTimeout(finishedQuestion, 200);
}
//function to update the quantity of an item
function updateQuantity() {
    connection.query("SELECT * FROM id", function (err, res) {
        console.log(res);
        inquirer
            .prompt({
                name: "choice",
                type: "rawlist",
                choices: function (value) {
                    var choiceArray = [];
                    console.log(res)
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].id)
                    }
                    return choiceArray;
                },
                message: "What item would you like to update? "
            }).then(function (answer) {
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name == answer.choice) {
                        var chosenItem = res[i];
                        inquirer
                            .prompt({
                                name: "quantity",
                                type: "input",
                                message: "What would you like to change the quantity to? ",
                                validate: function (value) {
                                    if (isNaN(value) == false) {
                                        return true;
                                    } else {
                                        return false;
                                    }

                                }
                            }).then(function (answer) {
                                connection.query("UPDATE products SET ? WHERE ?", [{
                                    quantity: answer.quantity
                                }, {
                                    id: chosenItem.id
                                }], function (err, res) {
                                    console.log("Item succesfully updated")

                                })
                            })
                    }
                }
            });
    })
    setTimeout(finishedQuestion, 200);
}
//query the name of the objects
function queryName() {
    connection.query("SELECT product_name FROM bamazon_db.products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].product_name);
            console.log("---------------------");
        }
    });
}
//prompts a decision to restart the program
function finishedQuestion() {
    inquirer
        .prompt([{
            type: 'confirm',
            message: "Would you like to go back to the main menu?",
            name: 'restart'
        }]).then(function (response) {
            if (response.restart) { initialQuestion(); }
            else {
                process.exit(bamazonManager.js);
            }
        })
}
//logs all the items, along with all of their 'stats'
function queryAllItems() {
    connection.query("SELECT product_name, category, cost, quantity FROM bamazon_db.products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].product_name + "||" + res[i].category + "||" + res[i].cost + "||" + res[i].quantity)
            console.log("----------------------------")
            var currentItems = res[i].product_name;
        }
    });
    setTimeout(finishedQuestion, 200);
}
//logs the items that have a quantity lower than 26
function queryLowItems() {
    connection.query("SELECT product_name, category, cost, quantity FROM bamazon_db.products WHERE quantity < 26", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            console.log(res[i].product_name + "|" + res[i].category + "|" + res[i].cost + "|" + res[i].quantity);
            console.log("----------------------------");
        }
    });
    setTimeout(finishedQuestion, 200);
}