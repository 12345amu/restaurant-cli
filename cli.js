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
    $ restaurant cancel       - Cancel a pending order
    $ restaurant summary      - View order summary
    $ restaurant search       - Search orders by item name
    $ restaurant report       - Show today's sales report
    $ restaurant generate-bill  - Generate and save bills for completed tables

`,
  { importMeta: import.meta }
);

export default cli;
