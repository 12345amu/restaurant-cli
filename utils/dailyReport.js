import fs from 'fs-extra';
import chalk from 'chalk';
import symbols from 'log-symbols';

const dailyReport =  () => {
    if (!fs.existsSync('orders.json')) {
        console.log(symbols.error, chalk.red('\n No orders found.'));
        return;
    }

    const orders = fs.readJsonSync('orders.json');
    const today = new Date().toISOString().split('T')[0];

    const todayOrders = orders.filter(order => {
        const orderDate = order.date ? order.date.split('T')[0] : null;
        return orderDate === today;
    });

    if (todayOrders.length === 0) {
        console.log(symbols.warning, chalk.yellow('\n No sales for today.'));
        return;
    }

    const totalEarnings = todayOrders.reduce((acc, curr) => acc + curr.total, 0);

    const itemSummary = {};

    todayOrders.forEach(order => {
        if (!itemSummary[order.item]) {
            itemSummary[order.item] = { quantity: 0, revenue: 0 };
        }
        itemSummary[order.item].quantity += order.quantity;
        itemSummary[order.item].revenue += order.total;
    });

    console.log(chalk.blue.bold(`\n  Daily Sales Report - ${today} \n`)); 
    console.log(chalk.green(`Total Orders: ${todayOrders.length}`));
    console.log(chalk.green(`Total Earnings: ₹${totalEarnings}\n`));

    console.log(chalk.cyan(`Item-wise Summary:`));
    for (const [item, summary] of Object.entries(itemSummary)) {
        console.log(`- ${item}: ${summary.quantity} sold | ₹${summary.revenue}`);
    }
};

export default dailyReport;
