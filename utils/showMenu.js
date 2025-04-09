import chalk from 'chalk';

const menu = [
    { id: 1, name: 'Pizza', price: 200 },
    { id: 2, name: 'Burger', price: 150 },
    { id: 3, name: 'Noodles', price: 120 },
    { id: 4, name: 'Biryani', price: 250 },
    { id: 5, name: 'Coke', price: 50 }
];

const showMenu = () => {
    console.log(chalk.blue.bold('\n Restaurant Menu:\n'));
    menu.forEach(item => {
        console.log(chalk.green(`${item.id}. ${item.name} - ₹${item.price}`));
    });
};

export default showMenu;
