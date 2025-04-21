// utils/welcome.js
import chalk from 'chalk';
import figlet from 'figlet';

const welcome = () => {
    console.log(
        chalk.green(
            figlet.textSync('Restaurant CLI', { horizontalLayout: 'default' })
        )
    );
    console.log(chalk.blue('Welcome to the Restaurant CLI!'));
    console.log(chalk.yellow('Manage your restaurant orders efficiently.'));
};

export default welcome;
