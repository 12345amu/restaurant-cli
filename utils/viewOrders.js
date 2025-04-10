import fs from 'fs-extra';
import chalk from 'chalk';
import symbols from 'log-symbols';

const viewOrders = () => {
    if (!fs.existsSync('orders.json')) {
        console.log(symbols.error, chalk.red('\n No orders found.'));
        return;
    }

    const orders = fs.readJsonSync('orders.json');

    if (orders.length === 0) {
        console.log(symbols.warning, chalk.yellow('\n No orders yet.'));
        return;
    }

    console.log(symbols.info, chalk.blue.bold('\n All Orders:\n'));
    orders.forEach((order, index) => {
        console.log(`${index + 1}. ${order.quantity} x ${order.item} - ₹${order.total} [${chalk.yellow(order.status)}] (ID: ${order.id}, ${order.table})`);
    });
};

export default viewOrders;
