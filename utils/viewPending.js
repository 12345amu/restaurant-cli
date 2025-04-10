import fs from 'fs-extra';
import chalk from 'chalk';

const viewPending = () => {
    if (!fs.existsSync('orders.json')) {
        console.log(chalk.red('\n No orders yet.'));
        return;
    }

    const orders = fs.readJsonSync('orders.json');
    const pending = orders.filter(order => order.status === 'pending');

    if (pending.length === 0) {
        console.log(chalk.yellow('\n No pending orders.'));
        return;
    }

    console.log(chalk.blue.bold('\n Pending Orders:\n'));
    pending.forEach((order, index) => {
        console.log(`${index + 1}. ${order.quantity} x ${order.item} - ₹${order.total} (ID: ${order.id}, ${order.table})`);
    });
};

export default viewPending;
