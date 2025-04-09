import inquirer from 'inquirer';
import fs from 'fs-extra';
import chalk from 'chalk';

const markCompleted = async () => {
    if (!fs.existsSync('orders.json')) {
        console.log(chalk.red('\n No orders to update.'));
        return;
    }

    const orders = fs.readJsonSync('orders.json');
    const pendingOrders = orders.filter(order => order.status === 'pending');

    if (pendingOrders.length === 0) {
        console.log(chalk.yellow('\n All orders are already completed.'));
        return;
    }

    const { orderId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'orderId',
            message: 'Select an order to mark as completed:',
            choices: pendingOrders.map(order => ({
                name: `${order.quantity} x ${order.item} - ₹${order.total} (ID: ${order.id})`,
                value: order.id
            }))
        }
    ]);

    const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status: 'completed' } : order
    );

    fs.writeJsonSync('orders.json', updatedOrders, { spaces: 2 });
    console.log(chalk.green('\n Order marked as completed.'));
};

export default markCompleted;
