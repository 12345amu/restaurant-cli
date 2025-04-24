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
import generateBill from './utils/generateBill.js';
import { displayTableStatus } from './utils/tableStatus.js';
import collectFeedback from './utils/feedback.js';
import welcome from './utils/welcome.js';
import reserveTable from './utils/reserveTable.js';
import orderOnline from './utils/orderOnline.js'; 

const run = async () => {
    welcome();

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
        case 'generate-bill':
            await generateBill();         
            await collectFeedback();      
            break;
        case 'table-status': 
            displayTableStatus(); 
            break;
        case 'reserve':
            await reserveTable();
            break;
        case 'order-online':
            await orderOnline();
            break;
            

        default:
            console.log('! Invalid command. Run: restaurant --help');
    } 
   
};

run();