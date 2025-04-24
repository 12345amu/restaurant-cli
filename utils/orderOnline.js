import inquirer from 'inquirer';
import fs from 'fs-extra';
import chalk from 'chalk';
import symbols from 'log-symbols';
import uniqid from 'uniqid';

const menu = {
    Starters: [
        { id: 1, name: 'Paneer Tikka', price: 180 },
        { id: 2, name: 'Veg Manchurian', price: 160 }
    ],
    Mocktails: [
        { id: 3, name: 'Virgin Mojito', price: 90 },
        { id: 4, name: 'Blue Lagoon', price: 100 }
    ],
    Biryani: [
        { id: 5, name: 'Veg Biryani', price: 200 },
        { id: 6, name: 'Chicken Biryani', price: 250 },
        { id: 7, name: 'Mutton Biryani', price: 300 }
    ],
    Desserts: [
        { id: 8, name: 'Gulab Jamun', price: 50 },
        { id: 9, name: 'Rasmalai', price: 70 }
    ],
    Beverages: [
        { id: 10, name: 'Coke', price: 50 },
        { id: 11, name: 'Lassi', price: 60 }
    ]
};

const orderOnline = async () => {
    console.log(chalk.yellow.bold('\n  Welcome to Online Food Delivery!\n'));

    const selectedItems = [];
    const quantities = {};

    let continueOrdering = true;

    while (continueOrdering) {
        // Step 1: Select category
        const { selectedCategory } = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedCategory',
                message: ' Select a category to order from:',
                choices: Object.keys(menu)
            }
        ]);

        // Step 2: Select items from category
        const categoryItems = menu[selectedCategory];

        const { items } = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'items',
                message: ` Select items from ${selectedCategory}:`,
                choices: categoryItems.map(item => ({
                    name: `${item.name} - ₹${item.price}`,
                    value: item
                }))
            }
        ]);

        for (const item of items) {
            const { quantity } = await inquirer.prompt([
                {
                    type: 'number',
                    name: 'quantity',
                    message: `Enter quantity for ${item.name}:`,
                    validate: value => value > 0 ? true : 'Quantity must be greater than 0'
                }
            ]);

            const existing = selectedItems.find(i => i.id === item.id);
            if (existing) {
                quantities[item.name] += quantity;
            } else {
                selectedItems.push(item);
                quantities[item.name] = quantity;
            }
        }

        // Ask if user wants to continue ordering from other categories
        const { more } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'more',
                message: 'Do you want to order from another category?',
                default: false
            }
        ]);

        continueOrdering = more;
    }

    if (selectedItems.length === 0) {
        console.log(symbols.warning, chalk.red(' You must select at least one item to place an order.'));
        return;
    }

    // Step 3: Get user details
    const { name, mobile, address } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter your name:'
        },
        {
            type: 'input',
            name: 'mobile',
            message: 'Enter your mobile number:',
            validate: value => /^\d{10}$/.test(value) ? true : 'Enter valid 10-digit mobile number'
        },
        {
            type: 'input',
            name: 'address',
            message: 'Enter your delivery address:'
        }
    ]);

    // Step 4: Final order details
    const orderId = uniqid('ord-');
    const totalAmount = selectedItems.reduce(
        (acc, item) => acc + item.price * (quantities[item.name] || 0),
        0
    );

    const order = {
        orderId,
        name,
        mobile,
        address,
        items: selectedItems.map(item => ({
            name: item.name,
            price: item.price,
            quantity: quantities[item.name],
            total: item.price * quantities[item.name]
        })),
        totalAmount,
        status: 'pending',
        orderedAt: new Date().toISOString()
    };

    // Save to file
    let onlineOrders = [];
    if (fs.existsSync('onlineOrders.json')) {
        onlineOrders = fs.readJsonSync('onlineOrders.json');
    }
    onlineOrders.push(order);
    fs.writeJsonSync('onlineOrders.json', onlineOrders, { spaces: 2 });

    // Order Summary
    console.log(symbols.success, chalk.green(`\n Order placed successfully!`));
    console.log(chalk.cyan(` Order ID   : ${orderId}`));
    console.log(chalk.cyan(` Name       : ${name}`));
    console.log(chalk.cyan(` Contact    : ${mobile}`));
    console.log(chalk.cyan(` Address    : ${address}`));
    console.log(chalk.cyan(` Total Amt  : ₹${totalAmount}\n`));
};

export default orderOnline;

