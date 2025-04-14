import inquirer from 'inquirer';
import fs from 'fs-extra';
import chalk from 'chalk';
import uniqid from 'uniqid';
import { table } from 'console';
import symbols from 'log-symbols';


const menu = [
    { id: 1, name: 'Pizza', price: 200 },
    { id: 2, name: 'Burger', price: 150 },
    { id: 3, name: 'Noodles', price: 120 },
    { id: 4, name: 'Biryani', price: 250 },
    { id: 5, name: 'Coke', price: 50 }
];

const placeOrder = async () => {
    const { tableNumber , itemId, quantity } = await inquirer.prompt([
        {
            type: 'input',
            name: 'tableNumber',
            message: 'Enter your table number',
            validate: value => value.trim() !== '' ? true : 'Please enter a valid table number'
        },
        {
            type: 'list',
            name: 'itemId',
            message: 'Choose an item to order:',
            choices: menu.map(item => ({ name: `${item.name} - ₹${item.price}`, value: item.id }))
        },
        {
            type: 'number',
            name: 'quantity',
            message: 'Enter quantity:',
            validate: value => value > 0 ? true : 'Please enter a valid quantity.'
        }
    ]);

    const selectedItem = menu.find(item => item.id === itemId);
    const total = selectedItem.price * quantity;

    let orders = [];
    if (fs.existsSync('orders.json')) {
        orders = fs.readJsonSync('orders.json');
    }

    const newOrder = {
        id: uniqid(),
        table:`Table ${tableNumber}`,
        item: selectedItem.name,
        quantity,
        total,
        status: 'pending',
        date: new Date().toISOString()
    };

    orders.push(newOrder);
    fs.writeJsonSync('orders.json', orders, { spaces: 2 });

    console.log(symbols.success, chalk.green(`\n Order placed: ${quantity} x ${selectedItem.name} (₹${total})`));
};

export default placeOrder;
