import inquirer from 'inquirer';
import fs from 'fs-extra';
import chalk from 'chalk';

const cancelOrder = async () => {
    if (!fs.existsSync('orders.json')) {
        console.log(chalk.red('\n No orders found.'));
        return;
    }

    const orders = fs.readJsonSync('orders.json');
    const pendingOrders = orders.filter(order => order.status === 'pending');

    if (pendingOrders.length === 0) {
        console.log(chalk.yellow('\n No pending orders to cancel.'));
        return;
    }

    const { orderId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'orderId',
            message: 'Select an order to cancel:',
            choices: pendingOrders.map(order => ({
                name: `${order.quantity} x ${order.item} - ₹${order.total} (ID: ${order.id})`,
                value: order.id
            }))
        }
    ]);

    const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
            return { ...order, status: 'cancelled' };
        }
        return order;
    });

    fs.writeJsonSync('orders.json', updatedOrders, { spaces: 2 });

    console.log(chalk.green('\n Order cancelled successfully.'));
};

export default cancelOrder;
