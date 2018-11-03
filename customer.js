const inquirer = require('inquirer');
const mysql = require('mysql');
const Table = require('cli-table');
const colors = require('colors');

let connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: 'root',
    database: 'Bamazon_DB'
});

connection.connect(err => {
    if (err) throw err;
    showAllProducts();
});

let showAllProducts = () => {
    let sqlString = `SELECT * FROM products`;
    connection.query(sqlString, (err, res) => {
        if (err) throw err;

        let table = new Table({
            head: ['Item Id#', 'Product Name', 'Price', 'Quantity'],
            style: {
                head: ['yellow'],
                compact: false,
                colAligns: ['center']
            }
        });

        let productsArray = [];
        let product_name = [];

        // Creating the visual table
        for (let i = 0; i < res.length; i++) {
            table.push([
                res[i].ItemID,
                res[i].ProductName,
                res[i].Price,
                res[i].StockQuanitiy
            ]);
            productsArray.push([
                res[i].ItemID,
                res[i].ProductName,
                res[i].Price,
                res[i].StockQuanitiy
            ]);
            product_name.push(res[i].ProductName);
        }

        let welcomeString = `                   Welcome to Jirgen Jorts
                This is our current inventory`;
        console.log(welcomeString.bold.blue);
        console.log(table.toString());

        promptCustomer(product_name, productsArray);
    });
};

let promptCustomer = (inventory, table) => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'option',
                message: 'What is the name of the item would you like to buy?'
                    .blue,
                choices: inventory
            }
        ])
        .then(val => {
            let choiceProduct = val.option;
            let product;
            for (let i = 0; i < table.length; i++) {
                if (table[i][1] === choiceProduct) {
                    console.log(choiceProduct + ' Chosen option');
                    product = checkAvailability(choiceProduct, table[i]);
                    var price = table[i][2];
                }
            }

            // If there is a product with the name the user chose, prompt the customer for a desired quantity
            if (product) {
                console.log(
                    'There is a product ' +
                        choiceProduct.blue +
                        ' available for purchase'
                );
                //   Pass the chosen product to promptCustomerForQuantity
                promptCustomerForQuantity(product, choiceProduct, price);
            } else {
                // Otherwise let them know the item is not in the inventory, re-run loadProducts
                console.log('\nThat item is not in the inventory. ' + product)
                    .red;
                showAllProducts();
            }
        });
};

let checkAvailability = (choiceProduct, inventory) => {
    console.log(choiceProduct + ' Chosen | ' + inventory[3] + ' available');
    let currentInventory = inventory[3];
    for (let i = 0; i < currentInventory; i++) {
        if (choiceProduct === currentInventory[i]) {
        }
        // If a matching product is found, return the product
        return currentInventory;
    }
    // Otherwise return null
    return null;
};

let quantityQuestions = [
    {
        type: 'input',
        name: 'quantity',
        message: 'Right on bruh, How many would you like to buy?'.yellow,
        validate: val => {
            return !isNaN(val) || val.toLowerCase() === 'q';
        }
    }
];

let promptCustomerForQuantity = (product, choiceProduct, price) => {
    inquirer.prompt(quantityQuestions).then(val => {
        checkIfExit(val.quantity);

        let quantity = parseInt(val.quantity);
        // If there isn't enough of the chosen product and quantity, let the user know and offer to shop more
        if (quantity > product) {
            console.log('\nInsufficient quantity!'.bgRed.black.bold);
        } else {
            // Otherwise run makePurchase, give it the product information and desired quantity to purchase
            console.log('Purchased!');
            makePurchase(choiceProduct, quantity, price);
        }
        console.log(quantity + ' Is the Quantity requested');
        console.log(product + ' is the quantity on hand');
        shopMore();
    });
};

let makePurchase = (choiceProduct, quantity, price) => {
    //let queryString = `UPDATE products SET StockQuanitiy = StockQuanitiy - ${quantity} WHERE ProductName = ${choiceProduct}`;
    connection.query(
        'UPDATE products SET StockQuanitiy = StockQuanitiy - ? WHERE ProductName = ?',
        [quantity, choiceProduct],
        (err, res) => {
            if (err) throw err;
            // console.log(res);
            // Let the user know the purchase was successful, offer to shop more
            console.log(
                '\nSuccessfully purchased ' +
                    quantity +
                    ' ' +
                    choiceProduct +
                    "'s!"
            );
            console.log('\nYour total is: $' + price.toFixed(2));
            shopMore();
        }
    );
};

let shopMore = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'shop',
                message: 'Would you like to continue shopping?'.blue,
                choices: ['Yes', 'No']
            }
        ])
        .then(answers => {
            if (answers.shop === 'Yes') {
                showAllProducts();
            } else {
                console.log('Thank you for Shopping with us!');
                process.exit(0);
            }
        });
};

let checkIfExit = choice => {
    if (choice.toLowerCase() === 'q') {
        // Log a message and exit the current node process
        console.log('Goodbye!');
        process.exit(0);
    }
};
