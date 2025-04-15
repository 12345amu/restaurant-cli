import fs from 'fs-extra';
import chalk from 'chalk';
import symbols from 'log-symbols';
import ora from 'ora';
import boxen from 'boxen';

const generateBill = async () => {
    const spinner = ora('Generating bills...').start();

    if (!fs.existsSync('orders.json')) {
        spinner.fail(chalk.red('No orders found.'));
        return;
    }

    const orders = fs.readJsonSync('orders.json');
    const completedOrders = orders.filter(order => order.status === 'completed');

    if (completedOrders.length === 0) {
        spinner.warn(chalk.yellow('No completed orders to generate bills.'));
        return;
    }

    const tableGroups = {};
    completedOrders.forEach(order => {
        if (!tableGroups[order.table]) {
            tableGroups[order.table] = [];
        }
        tableGroups[order.table].push(order);
    });

    spinner.succeed('Bills generated:\n');

    for (const table in tableGroups) {
        const tableOrders = tableGroups[table];
        let total = 0;

        let billText = `Bill for Table: ${table}\n`;

        tableOrders.forEach((order, i) => {
            billText += `${i + 1}. ${order.quantity} x ${order.item} = ₹${order.total}\n`;
            total += order.total;
        });

        billText += `Total Amount: ₹${total}\n`;

        console.log(
            boxen(billText, {
                padding: 1,
                borderColor: 'green',
                borderStyle: 'round',
            })
        );

        const fileContent = billText;
        const filename = `bill-${table}.txt`;
        fs.writeFileSync(filename, fileContent);

        console.log(symbols.success, chalk.green(`Bill saved to ${filename}\n`));
        
    }

};
export default generateBill;