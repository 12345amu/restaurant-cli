import inquirer from 'inquirer';
import fs from 'fs-extra';
import chalk from 'chalk';
import symbols from 'log-symbols';
import uniqid from 'uniqid';

const reserveTable = async () => {
    console.log(chalk.yellow.bold('\n  Table Reservation System\n'));

    // Prompt for reservation details
    const { name, people, dateTime, tableNumber } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter your name:',
            validate: value => value.trim() !== '' ? true : 'Name is required'
        },
        {
            type: 'number',
            name: 'people',
            message: 'How many people?',
            validate: value => value > 0 ? true : 'At least 1 person required'
        },
        {
            type: 'input',
            name: 'dateTime',
            message: 'Enter date and time (e.g., 2025-04-18 7:30PM):',
            validate: value => value.trim() !== '' ? true : 'Please enter a valid date and time'
        },
        {
            type: 'input',
            name: 'tableNumber',
            message: 'Enter table number you want to reserve:',
            validate: value => value.trim() !== '' ? true : 'Table number is required'
        }
    ]);

    // Load existing reservations if available
    let reservations = [];
    if (fs.existsSync('reservations.json')) {
        reservations = fs.readJsonSync('reservations.json');
    }

    // Check if the same table is already booked for the same date & time
    const isTableAlreadyReserved = reservations.some(
        res =>
            res.dateTime.trim().toLowerCase() === dateTime.trim().toLowerCase() &&
            res.tableNumber.trim().toLowerCase() === tableNumber.trim().toLowerCase()
    );

    if (isTableAlreadyReserved) {
        console.log(
            symbols.error,
            chalk.red(`\n Table ${tableNumber} is already reserved at ${dateTime}. Please choose a different table or time.\n`)
        );
        return;
    }

    // Create new reservation
    const newReservation = {
        id: uniqid('res-'),
        name,
        people,
        dateTime,
        tableNumber,
        status: 'booked',
        createdAt: new Date().toISOString()
    };

    // Save new reservation
    reservations.push(newReservation);
    fs.writeJsonSync('reservations.json', reservations, { spaces: 2 });

    // Confirmation
    console.log(symbols.success, chalk.green(`\n Reservation confirmed!`));
    console.log(chalk.cyan(`Reservation ID : ${newReservation.id}`));
    console.log(chalk.cyan(`Name           : ${name}`));
    console.log(chalk.cyan(`Guests         : ${people}`));
    console.log(chalk.cyan(`Date & Time    : ${dateTime}`));
    console.log(chalk.cyan(`Table Number   : ${tableNumber}\n`));
};

export default reserveTable;
