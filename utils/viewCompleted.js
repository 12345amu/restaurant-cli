import fs from 'fs-extra';
import chalk from 'chalk';

const viewCompleted = () => {
    if (!fs.existsSync('orders.json')) {
        console.log(chalk.red('\n No orders yet.'));
        return;
    }

    const orders = fs.readJsonSync('orders.json');
    const completed = orders.filter(order => order.status === 'completed');

    if (completed.length === 0) {
        console.log(chalk.yellow('\n No completed orders.'));
        return;
    }

    console.log(chalk.blue.bold('\n Completed Orders:\n'));
    completed.forEach((order, index) => {
        console.log(`${index + 1}. ${order.quantity} x ${order.item} - ₹${order.total} (ID: ${order.id})`);
    });
};

export default viewCompleted;
