import fs from 'fs-extra';
import chalk from 'chalk';

const summary = () => {
    if (!fs.existsSync('orders.json')) {
        console.log(chalk.red('\n No orders yet.'));
        return;
    }

    const orders = fs.readJsonSync('orders.json');
    const total = orders.length;
    const pending = orders.filter(order => order.status === 'pending').length;
    const completed = orders.filter(order => order.status === 'completed').length;
    const cancelled = orders.filter(order => order.status === 'cancelled').length;

    console.log(chalk.blue.bold('\n Order Summary:\n'));
    console.log(chalk.green(`Total Orders: ${total}`));
    console.log(chalk.yellow(`Pending Orders: ${pending}`));
    console.log(chalk.magenta(`Completed Orders: ${completed}`));
    console.log(chalk.red(` Cancelled Orders : ${cancelled}`));
 
};

export default summary;
