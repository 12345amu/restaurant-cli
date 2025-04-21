import chalk from 'chalk';

const menu = {
    Starters: [
        { id: 1, name: 'Paneer Tikka', price: 180 },
        { id: 2, name: 'Veg Manchurian', price: 160 }
    ],
    Mocktails: [
        { id: 3, name: 'Virgin Mojito', price: 90 },
        { id: 4, name: 'Blue Lagoon', price: 100 }
    ],
    Biryani: [
        { id: 5, name: 'Veg Biryani', price: 200 },
        { id: 6, name: 'Chicken Biryani', price: 250 },
        { id: 7, name: 'Mutton Biryani', price: 300 }
    ],
    Desserts: [
        { id: 8, name: 'Gulab Jamun', price: 50 },
        { id: 9, name: 'Rasmalai', price: 70 }
    ],
    Beverages: [
        { id: 10, name: 'Coke', price: 50 },
        { id: 11, name: 'Lassi', price: 60 }
    ]
};

const showMenu = () => {
    console.log(chalk.blue.bold('\n Restaurant Menu:\n')); 

    Object.entries(menu).forEach(([category, items]) => {
        console.log(chalk.yellow.bold(` ${category}:`)); 
        items.forEach(item => {
            console.log(chalk.green(`  ${item.id}. ${item.name} - ₹${item.price}`));
        });
        console.log(); // line break between categories
    });
};

export default showMenu;
export { menu };
