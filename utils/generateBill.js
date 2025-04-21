import fs from 'fs-extra';
import chalk from 'chalk';
import symbols from 'log-symbols';
import ora from 'ora';
import boxen from 'boxen';
import inquirer from 'inquirer';
import collectFeedback from './feedback.js';


const GST_PERCENTAGE = 18;

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
        let subtotal = 0;
        let paymentMethod = 'N/A';

        let billText = `Bill for Table: ${table}\n`;

        tableOrders.forEach((order, i) => {
            billText += `${i + 1}. ${order.quantity} x ${order.item} = ₹${order.total}\n`;
            subtotal += order.total;
            if (order.paymentMethod) {
                paymentMethod = order.paymentMethod;
            }
        });

        const gstAmount = (subtotal * GST_PERCENTAGE) / 100;
        const totalAmount = subtotal + gstAmount;

        const { selectedPaymentMethod } = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedPaymentMethod',
                message: 'Select the payment method for this bill:',
                choices: ['Cash', 'UPI', 'Card'],
                default: paymentMethod,
            },
            ]);
        billText += `\nSubtotal: ₹${subtotal}\n`;
        billText += `GST (${GST_PERCENTAGE}%): ₹${gstAmount}\n`;
        billText += `Total Amount: ₹${totalAmount}\n`;
        billText += `Payment Method: ${selectedPaymentMethod}\n`;

        tableOrders.forEach(order => {
            order.paymentMethod = selectedPaymentMethod;  // Update payment method for each order in the table
        });

        fs.writeJsonSync('orders.json', orders, { spaces: 2 });

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
        
        const feedback = await collectFeedback(table);
        if (feedback) {
            const allFeedback = fs.existsSync('feedbacks.json')
                ? fs.readJsonSync('feedbacks.json')
                : [];

            allFeedback.push({
                table,
                feedback,
                date: new Date().toLocaleString(),
            });

            fs.writeJsonSync('feedbacks.json', allFeedback, { spaces: 2 });

            console.log(symbols.info, chalk.cyan(`Feedback saved for ${table}.\n`));
        }
        
    }

};
export default generateBill;