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
                console.log("LMFAOOOOOOOO");
            }

            else if (answers.first === 1) {
                queryLowItems();
                console.log("lmfaoo")
            }

            else if (answers.first === 2) {
                addInventory();
                console.log("AKLSNFLKNFALK MWL:")
            }

            else if (answers.first === 3) {


            }
            else { console.log("Your shits broken") }
        })
}
function queryAllItems() {
    connection.query("SELECT product_name, category, cost, quantity FROM bamazon_db.products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].product_name + "||" + res[i].category + "||" + res[i].cost + "||" + res[i].quantity)
            console.log("----------------------------")
            var currentItems = res[i].product_name;
        }
    });
}
function queryLowItems() {
    connection.query("SELECT product_name, category, cost, quantity FROM bamazon_db.products WHERE quantity < 25", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            console.log(res[i].product_name + "|" + res[i].category + "|" + res[i].cost + "|" + res[i].quantity);
            console.log("----------------------------");
        }
    });
}

function addInventory() {

    connection.query("SELECT product_name, category, cost, quantity FROM bamazon_db.products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].product_name + "|" + res[i].category + "|" + res[i].cost + "|" + res[i].quantity);
            console.log("----------------------------");
            var currentItems = res[i].product_name+"\n"
        }
        inquirer
            .prompt({
                type: "list",
                message: "Which item would you like to increase the quantity of?",
                name: "inventory",
                choices: currentItems
            }).then(answers => {
                console.log(answers);
            });
    });
}











