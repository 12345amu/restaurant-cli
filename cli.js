import meow from 'meow';
import chalk from 'chalk';

const cli = meow(
  `
  ${chalk.green.bold(' Restaurant CLI')}

  ${chalk.blue('Usage:')}
    $ restaurant menu         - Show menu
    $ restaurant order        - Place a new order
    $ restaurant view         - View all orders
    $ restaurant complete     - Mark order as completed
    $ restaurant pending      - View pending orders
    $ restaurant completed    - View completed orders
    $ restaurant summary      - View order summary
`,
  { importMeta: import.meta }
);

export default cli;
