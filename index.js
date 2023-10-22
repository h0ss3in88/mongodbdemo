import {config} from 'dotenv'
import {Db} from './src/db.js'

(async function init() {
    config();
    const db = new Db();
    try {
        await db.connect();
        await db.innit();
        const dbs = await db.getAllDataBases();
        const collections = await db.getAllCollections();
        const users = await db.getAllUsers();


        console.log(`users: \r\n`);
        users.forEach(u => console.log(u._id));
        console.log(`databases : \r\n`);
        dbs.forEach(e => console.log(`${e.name} \t`));
        console.log(`collections : \r\n`);
        collections.forEach(c => console.log(`${c.name}`));

        console.log('get users who has age equals to 25 and last name equals to Beckham');

        const usersReturned = await db.getUsersWithAgeAndLastName('Beckham', 25);
        console.log(usersReturned[0]);

        console.log('get employees who has age more than 26');

        const employees = await db.getEmployees();
        employees.forEach(e => console.log(e));
        
        console.log('get users with age more than 22');

        const returnedUserByAge = await db.getUsersWithAge(27);
        console.log(returnedUserByAge[0]);

        console.log('get users who are female');
        const usersFem = await db.getUsersByGender();
        usersFem.forEach(u => console.log(u));

        const getJessica = await db.getUsersByFirstName();
        console.log(getJessica.length);
        console.log(getJessica[0]);

        const getUsersByAge = await db.getUsersWithAge(20);
        console.log(getUsersByAge);
        getUsersByAge.forEach(u => console.log(u.age));

        const getUsersThatTheirFirstNameStartsWithJ = await db.getUserByRegexName();
        console.log(getUsersThatTheirFirstNameStartsWithJ);
    } catch (error) {
        console.log(error);
    }finally {
        await db.disconnect();
    }
})();