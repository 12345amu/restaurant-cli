#!/usr/bin/env node
import cli from './cli.js';
import showMenu from './utils/showMenu.js';
import placeOrder from './utils/placeOrder.js';
import viewOrders from './utils/viewOrders.js';
import markCompleted from './utils/markCompleted.js';
import viewPending from './utils/viewPending.js';
import viewCompleted from './utils/viewCompleted.js';
import cancelOrder from './utils/cancelOrder.js';
import summary from './utils/summary.js';
import searchOrdersByItem from './utils/searchOrdersByItem.js';
import dailyReport from './utils/dailyReport.js';

const run = async () => {
    const [command] = cli.input;

    switch (command) {
        case 'menu':
            showMenu();
            break;
        case 'order':
            await placeOrder();
            break;
        case 'view':
            viewOrders();
            break;
        case 'complete':
            await markCompleted();
            break;
        case 'pending':
            viewPending();
            break;
        case 'completed':
            viewCompleted();
            break;
        case 'cancel':
            cancelOrder();
            break;            
        case 'summary':
            summary();
            break;
        case 'search':
            searchOrdersByItem();
            break;
        case 'report':
            dailyReport();
            break;
        default:
            console.log('! Invalid command. Run: restaurant --help');
    }
};

run();
