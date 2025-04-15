import fs from 'fs-extra';
import chalk from 'chalk';
import symbols from 'log-symbols';
import inquirer from 'inquirer';

const dailyReport =  async() => {
    if (!fs.existsSync('orders.json')) {
        console.log(symbols.error, chalk.red('\n No orders found.'));
        return;
    }

    const orders = fs.readJsonSync('orders.json');
    // const today = new Date().toISOString().split('T')[0];

    const {date } = await inquirer.prompt([
        {
            type: 'input',
            name: 'date',
            message: 'Enter the date of the report (YYYY-MM-DD):',
            validate: (input) => {
                const isValidate = /^\d{4}-\d{2}-\d{2}$/.test(input);
                return isValidate ? true : 'Please enter a valid date (YYYY-MM-DD)';
                }
            }
        ]);
         const selectedDate = new Date(date);
         if(isNaN(selectedDate)) {
            console.log(symbols.error, chalk.red('\n Invalid date format.'));
            return;
         }
         const dateString = selectedDate.toISOString().split('T')[0];
         const filteredOrders = orders.filter(order =>{
            const orderDate = order.date ? order.date.split('T')[0] :null;
            return orderDate === dateString;
        });

        if (filteredOrders.length === 0) {
            console.log(symbols.warning, chalk.yellow('\n No orders found for the date ${dateString}.'));
            return;
        }
            
        console.log(chalk.blue.bold(`\n Daily Report for ${dateString}:`));

        filteredOrders.forEach((order, index) => {
            const statusColor = order.status === 'cancelled'
            ? chalk.red
            : order.status === 'completed'
            ? chalk.green
            : chalk.yellow;

            console.log(
            `${index + 1}. ${order.quantity} * ${order.item} - ${order.total} [${statusColor(order.status)}] (ID: ${order.id}, Table: ${order.table})`
            );
        });
                
        const totalAmount = filteredOrders
        .filter(order => order.status !== 'cancelled')
        .reduce((sum, order) => sum + order.total, 0);

        console.log(chalk.green(`\n Total Amount (excluding cancelled): ${totalAmount}`));

    };


export default dailyReport;
