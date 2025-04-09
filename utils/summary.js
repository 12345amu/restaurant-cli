import fs from 'fs-extra';
import chalk from 'chalk';

const summary = () => {
    if (!fs.existsSync('orders.json')) {
        console.log(chalk.red('\n No orders yet.'));
        return;
    }

    const orders = fs.readJsonSync('orders.json');
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const completed = orders.filter(o => o.status === 'completed').length;

    console.log(chalk.blue.bold('\n Order Summary:\n'));
    console.log(chalk.green(`Total Orders: ${total}`));
    console.log(chalk.yellow(`Pending Orders: ${pending}`));
    console.log(chalk.magenta(`Completed Orders: ${completed}`));
};

export default summary;
