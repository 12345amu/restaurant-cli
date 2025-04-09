import fs from 'fs-extra';
import chalk from 'chalk';

const viewOrders = () => {
    if (!fs.existsSync('orders.json')) {
        console.log(chalk.red('\n No orders found.'));
        return;
    }

    const orders = fs.readJsonSync('orders.json');

    if (orders.length === 0) {
        console.log(chalk.yellow('\n No orders yet.'));
        return;
    }

    console.log(chalk.blue.bold('\n All Orders:\n'));
    orders.forEach((order, index) => {
        console.log(`${index + 1}. ${order.quantity} x ${order.item} - ₹${order.total} [${chalk.yellow(order.status)}] (ID: ${order.id})`);
    });
};

export default viewOrders;
