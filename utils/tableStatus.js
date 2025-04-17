import fs from 'fs-extra';
import chalk from 'chalk';

const displayTableStatus = () => {
    const ordersPath = './orders.json'; 

    if (!fs.existsSync(ordersPath)) {
        console.log(chalk.red(' orders.json file not found.'));
        return;
    }

    const orders = fs.readJsonSync(ordersPath);

    if (orders.length === 0) {
        console.log(chalk.yellow(' No orders yet.'));
        return;
    }

    const latestTableStatus = new Map();

    const sortedOrders = orders.sort((a, b) => new Date(b.date) - new Date(a.date));

    for (const order of sortedOrders) {
        const table = order.table;
        if (!latestTableStatus.has(table)) {
            latestTableStatus.set(table, order.status);
        }
    }

    let free = 0, occupied = 0;

    console.log(chalk.cyan('\n Live Table Status Dashboard'));
    

    for (const [table, status] of latestTableStatus.entries()) {
        let statusText = '';
        let colorFunc = chalk.white;

        if (status === 'pending' || status === 'in-progress') {
            statusText = 'Occupied';
            colorFunc = chalk.yellow;
            occupied++;
        
        } else if (status === 'completed' || status === 'cancelled') {
            statusText = 'Free';
            colorFunc = chalk.green;
            free++;
        } else {
            statusText = 'Unknown';
            colorFunc = chalk.gray;
        }

        console.log(`Table ${table}: ${colorFunc(statusText)}`);
    }

    console.log(
        `Free: ${chalk.green()} ${chalk.green(free)} | ` +
        `Occupied: ${chalk.yellow()} ${chalk.yellow(occupied)} \n`
    );
};
export { displayTableStatus };
