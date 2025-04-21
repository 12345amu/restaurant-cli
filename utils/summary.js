import fs from 'fs-extra';
import chalk from 'chalk';

const GST_RATE = 18;

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

    const totalIncome = orders.reduce((acc, order) => acc + order.total, 0);

    const gstAmount = (totalIncome * GST_RATE) / (100 + GST_RATE);
    const baseAmount = totalIncome - gstAmount;

    console.log(chalk.blue.bold('\n Order Summary:\n'));
    console.log(chalk.green(`Total Orders: ${total}`));
    console.log(chalk.yellow(`Pending Orders: ${pending}`));
    console.log(chalk.magenta(`Completed Orders: ${completed}`));
    console.log(chalk.red(` Cancelled Orders : ${cancelled}`));
    console.log(chalk.cyan(`\nTotal Income (incl. GST): ${totalIncome.toFixed(2)}`));
    console.log(chalk.gray(`Base Amount (excl. GST):  ${baseAmount.toFixed(2)}`));
    console.log(chalk.gray(`GST @${GST_RATE}%:         ${gstAmount.toFixed(2)}\n`));

 
};

export default summary;
