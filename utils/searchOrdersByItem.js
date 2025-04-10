import fs from 'fs-extra';
import inquirer from 'inquirer';
import chalk from 'chalk';
import symbols from 'log-symbols';

const searchOrdersByItem = async () => {
    if (!fs.existsSync('Orders.json')){
        console.log(symbols.error, chalk.red('No Orders found.'));
        return;
    }

    const orders = fs.readJsonSync('orders.json');

    if (orders.length === 0) {
        console.log(symbols.warning, chalk.yellow('No Orders yet.'));
        return;
    }

    const { searchItem } = await inquirer.prompt([
        {
            type: 'input',
            name: 'searchItem',
            message: 'Enter the item you want to search for:',
        }
        ]);

        const filteredOrders = orders.filter(order => 
            order.item.toLowerCase().includes(searchItem.toLowerCase())
        );

        if (filteredOrders.length === 0) {
            console.log(symbols.error, chalk.red(' No matching orders found: ${searchItem}'));
            return;
        }

        console.log(symbols.info, chalk.blue.bold(`Orders for "${searchItem}":\n`));
        filteredOrders.forEach((order , index ) => {
            console.log(`${index + 1}. ${order.quantity} x ${order.item} - ₹${order.total} [${chalk.yellow(order.status)}] (ID: ${order.id}, ${order.table})`);
            });

            console.log(symbols.success, chalk.green(`${filteredOrders.length} orders matched`));
};

export default searchOrdersByItem;