import inquirer from 'inquirer';
import chalk from 'chalk';

const collectFeedback = async () => {
    const { feedback } = await inquirer.prompt([
        {
            type: 'input',
            name: 'feedback',
            message: 'Any feedback or suggestions for us? (press enter to skip)',
            default: ''
        }
    ]);

    if (feedback.trim()) {
        console.log(chalk.cyan('\nThank you! Your feedback has been recorded.'));
    } else {
        console.log(chalk.gray('\nNo feedback given.'));
    }

    return feedback.trim();
};

export default collectFeedback;
