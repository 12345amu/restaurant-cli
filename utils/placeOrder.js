import inquirer from 'inquirer';
import fs from 'fs-extra';
import chalk from 'chalk';
import uniqid from 'uniqid';
import { table } from 'console';
import symbols from 'log-symbols';


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

const flatMenu = Object.entries(menu).flatMap(([category, items]) =>
    items.map(item => ({
        ...item,
        category
    }))
);

const itemMap = {};
flatMenu.forEach(item => {
    itemMap[item.id] = item;
});

const placeOrder = async () => {
    const { tableNumber } = await inquirer.prompt([
        {
            type: 'input',
            name: 'tableNumber',
            message: 'Enter your table number',
            validate: value => value.trim() !== '' ? true : 'Please enter a valid table number'
        },
        ]);

        const { category } = await inquirer.prompt([
            {
                type: 'list',
                name: 'category',
                message: 'Select a category:',
                choices: Object.keys(menu)
            }
        ]);

        const selectedItems = menu[category];
        const { itemId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'itemId',
            message: `Select an item from ${category}:`,
            choices: selectedItems.map(item => ({
                name: `${item.name} - ₹${item.price}`,
                value: item.id
            }))
        }
    ]);

    const selectedItem = itemMap[itemId];

    const { quantity } = await inquirer.prompt([
        {
            type: 'number',
            name: 'quantity',
            message: `Enter quantity for ${selectedItem.name}:`,
            validate: value => value > 0 ? true : 'Quantity must be at least 1'
        }
    ]);

        // {
        //     type: 'list',
        //     name: 'paymentMethod',
        //     message: 'Select payment method:',
        //     choices: ['Cash', 'UPI', 'Card']
        // }
    

    
    const subtotal = selectedItem.price * quantity;
    const gstPercentage = 18;
    const gstAmount = +(subtotal * (gstPercentage / 100)).toFixed(2);
    const total = subtotal + gstAmount;

    let orders = [];
    if (fs.existsSync('orders.json')) {
        orders = fs.readJsonSync('orders.json');
    }

    const newOrder = {
        id: uniqid(),
        table:`Table ${tableNumber}`,
        item: selectedItem.name,
        quantity,
        subtotal,
        gstPercentage,
        gstAmount,
        total,
        status: 'pending',
        // 
        // paymentMethod,
        date: new Date().toISOString()
    };

    orders.push(newOrder);
    fs.writeJsonSync('orders.json', orders, { spaces: 2 });

    console.log(symbols.success, chalk.green(`\n Order placed: ${quantity} x ${selectedItem.name} (₹${subtotal})`));
    console.log(chalk.blue(`Subtotal: ${subtotal}`)); 
    console.log(chalk.yellow(`GST (${gstPercentage}%): ${gstAmount}`)); 
    console.log(chalk.green.bold(`Total: ${total}\n`));
    // console.log(chalk.cyan(`Payment Method: ${paymentMethod}\n`));
};

export default placeOrder;
