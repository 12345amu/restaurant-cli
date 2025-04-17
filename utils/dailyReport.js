import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import symbols from 'log-symbols';
import figlet from 'figlet';
import boxen from 'boxen';
import ora from 'ora';
import pkg from 'enquirer';
const { Input } = pkg;

const dailyReport = async (reportDate = null) => {
    
    console.log(
        chalk.cyan(
            figlet.textSync('Restaurant Report', {
                horizontalLayout: 'default'
            })
        )
    );

    
    if (!reportDate) {
        const prompt = new Input({
            message: 'Enter the date of the report (YYYY-MM-DD)',
            initial: new Date().toISOString().slice(0, 10),
        });
        reportDate = await prompt.run();
    }

    const ordersPath = 'orders.json';

    if (!fs.existsSync(ordersPath)) {
        console.log(symbols.error, chalk.red('No orders found.'));
        return;
    }

    const spinner = ora('Loading orders...').start();
    const orders = await fs.readJson(ordersPath);
    spinner.succeed('Orders loaded.');

    const filteredOrders = orders.filter(order => 
        order.date && order.date.startsWith(reportDate) && 
        order.status !== 'pending'
);

    if (filteredOrders.length === 0) {
        console.log(symbols.warning, chalk.yellow(`No orders found for ${reportDate}.`));
        return;
    }

    let totalIncome = 0;
    let totalOrders = 0;
    let cancelledCount = 0;
    const itemCount = {};

    filteredOrders.forEach(order => {
        if (order.status === 'cancelled') {
            cancelledCount++;
        } else {
            totalOrders++;
            totalIncome += order.total;
            if (!itemCount[order.item]) {
                itemCount[order.item] = 0;
            }
            itemCount[order.item] += order.quantity;
        }
    });

    const report = {
        date: reportDate,
        totalOrders,
        totalIncome,
        cancelledCount,
        itemCount
    };

    
    const reportDir = path.join('reports');
    const filePath = path.join(reportDir, `daily-${reportDate}.json`);
    await fs.ensureDir(reportDir);
    await fs.writeJson(filePath, report, { spaces: 2 });

    
    console.log(chalk.green.bold(`\n Daily Report for ${reportDate}`)); 
    console.log(`${chalk.blue(' Total Orders')}:        ${totalOrders}`); 
    console.log(`${chalk.blue(' Total Income')}:       ₹${totalIncome}`); 
    console.log(`${chalk.blue(' Cancelled Orders')}:   ${cancelledCount}`); 

     
    console.log(chalk.gray('\n Items Sold:')); 
    Object.entries(itemCount).forEach(([item, count]) => {
        console.log(`  - ${chalk.yellow(item)}: ${count}`);
    });

    
    console.log(boxen(`Report saved to ${filePath}`, {
        padding: 1,
        borderColor: 'green',
        align: 'center'
    }));
};

export default dailyReport;