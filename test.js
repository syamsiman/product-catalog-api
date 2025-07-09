// testDataHandler.js
import { readProducts, writeProducts, readUsers, writeUsers } from './utils/dataHandler';

async function testDataOperations() {
    console.log('--- Testing Product Data ---');
    let products = await readProducts();
    console.log('Initial products:', products);

    if (products.length === 0) {
        products.push({ id: 'prod1', name: 'Laptop', price: 1200 });
        products.push({ id: 'prod2', name: 'Mouse', price: 25 });
        await writeProducts(products);
        console.log('Products written:', await readProducts());
    } else {
        console.log('Products already exist, skipping initial write.');
    }

    console.log('\n--- Testing User Data ---');
    let users = await readUsers();
    console.log('Initial users:', users);

    if (users.length === 0) {
        users.push({ id: 'user1', username: 'alice', email: 'alice@example.com' });
        await writeUsers(users);
        console.log('Users written:', await readUsers());
    } else {
        console.log('Users already exist, skipping initial write.');
    }
}

testDataOperations().catch(console.error);