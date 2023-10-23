import {MongoClient, ServerApiVersion, ObjectId} from "mongodb"

export class Db {
    constructor(args) {
        args = args || {};
        const connectionSting = process.env.MONGODB_CONNECTION_STRING || args.connectionString;
        this.client = new MongoClient(connectionSting , {
            serverApi : {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true
            }
        });
    }
    async innit() {
        try {
            await this.db.collection("users").drop({noResponse: true});
            await this.db.collection("products").drop({noResponse: true});
            await this.db.collection("employees").drop({noResponse: true});

            const productsResult = await this.db.collection("products").insertMany([
                { "name" : "xPhone", "price" : 799, "releaseDate": Date.parse("2011-05-14"), "spec" : { "ram" : 4, "screen" : 6.5, "cpu" : 2.66 },"color":["white","black"],"storage":[64,128,256]},
                { "name" : "xTablet", "price" : 899, "releaseDate":  Date.parse("2011-09-01") , "spec" : { "ram" : 16, "screen" : 9.5, "cpu" : 3.66 },"color":["white","black","purple"],"storage":[128,256,512]},
                { "name" : "SmartTablet", "price" : 899, "releaseDate":  Date.parse("2015-01-14"), "spec" : { "ram" : 12, "screen" : 9.7, "cpu" : 3.66 },"color":["blue"],"storage":[16,64,128]},
                { "name" : "SmartPad", "price" : 699, "releaseDate":  Date.parse("2020-05-14"),"spec" : { "ram" : 8, "screen" : 9.7, "cpu" : 1.66 },"color":["white","orange","gold","gray"],"storage":[128,256,1024]},
                { "name" : "SmartPhone", "price" : 599,"releaseDate":  Date.parse("2022-09-14"), "spec" : { "ram" : 4, "screen" : 9.7, "cpu" : 1.66 },"color":["white","orange","gold","gray"],"storage":[128,256]}
            ]);
            const employeesResult = await this.db.collection("employees").insertMany([
                {
                    "name" : "John",
                    "father_name" : "Thomas",
                    "department" : "Contain Writting",
                    "experience" : 2,
                    "mobile_no" : 9856321478,
                    "gender" : "Male",
                    "salary" : 22000,
                    "age" : 26
            },
            {
                    "name" : "William",
                    "father_name" : "Rebort",
                    "department" : "Softwre Tester",
                    "experience" : 1,
                    "mobile_no" : 7896541478,
                    "gender" : "Male",
                    "salary" : 20000,
                    "age" : 21
            },
            {
                    "name" : "Ava",
                    "father_name" : "William",
                    "department" : "Marketing manager",
                    "experience" : 5,
                    "mobile_no" : 8789654178,
                    "gender" : "Female",
                    "salary" : 36500,
                    "age" : 25 
            },
            {
                    "name" : "Olivia",
                    "father_name" : "Noah",
                    "department" : null,
                    "experience" : 4,
                    "mobile_no" : 9045641478,
                    "gender" : "Female",
                    "salary" : 30000,
                    "age" : 27 
            },
            {
                    "name" : "Elijah",
                    "father_name" : "John",
                    "department" : "HR",
                    "experience" : 0,
                    "mobile_no" : 6589741230,
                    "gender" : "Male",
                    "salary" : 15000,
                    "age" : 20
            },
            {
                    "name" : "John",
                    "father_name" : "Liam",
                    "department" : "Softwre Tester",
                    "experience" : 10,
                    "mobile_no" : 9014536987,
                    "gender" : "Male",
                    "salary" : 55000,
                    "age" : 30 
            }
            ]);
            const insertResult = await this.db.collection("users").insertMany([{
                "first_name" : "Maria",
                "last_name" : "Joseph",
                "age" : 20,
                "gender": "female",
                "created_at" : Date.now(),
                "modified_at" : Date.now()
            },{
                "first_name" : "Jessica",
                "last_name" : "Jackson",
                "age" : 30,
                "gender": "female",
                "created_at" : Date.now(),
                "modified_at" : Date.now()
            },{
                "first_name" : "Mike",
                "last_name" : "Green",
                "age" : 25,
                "gender": "male",
                "created_at" : Date.now(),
                "modified_at" : Date.now()
            },{
                "first_name" : "David",
                "last_name" : "Beckham",
                "age" : 25,
                "gender": "male",
                "created_at" : Date.now(),
                "modified_at" : Date.now()
            }]);
            console.log(insertResult);
            return insertResult;
        }catch(error) {
            throw new Error(error.message);   
        }
    }
    async connect() {
        try {
            this.connection = await this.client.connect();
            this.db = this.connection.db(process.env.MONGODB_DB_NAME);
        }catch(err) {
            throw new Error(err.message);
        }
    }
    async disconnect() {
        try{
            await this.client.close();
        }catch(err) {
            throw new Error(err.message);
        }
    }
    async getAllCollections() {
        try {
            const collections = await this.db.listCollections().toArray();
            return collections;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async getAllDataBases() {
        try {
            const dbs = await this.client.db().admin().listDatabases();
            return dbs.databases;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async getAllUsers() {
        try {
            const users = await this.db.collection("users").find({}).toArray();
            return users;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    getUsersWithAge(age) {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await this.db.collection("users").find({
                    'age' : { '$gt' : age }
                }).toArray();
                return resolve(users);
            }catch(error) {
                return reject(error);             
            }
        });
    }
    getUsersByFirstName() {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await this.db.collection("users").find({
                    'first_name' : 'John'
                }).toArray();
                return resolve(users);
            }catch(error) {
                return reject(error);
            }
        });
    }
    getUsersWithAge(conditionAge) {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await this.db.collection("users").find({
                    'age' : { '$gt' : conditionAge}
                }).toArray();
                return resolve(users);
            } catch (error) {
                return reject(error);
            }
        });
    }
    getUserByRegexName(firstAlphabet = 'J') {
        return new Promise(async (resolve, reject) => {
            try {
                const pattern = `(?i)${firstAlphabet}`;
                const users = await this.db.collection("users").find(
                    {'first_name' : {'$regex' : pattern, '$options' : 'i'}}
                ).toArray();
                return resolve(users);
            } catch (error) {
                console.log(error);
                return reject(error);
            }
        });
    }
    getUsersByGender(gender = 'female') {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await this.db.collection("users").find({'gender' : gender}).toArray();
                return resolve(users);
            } catch (error) {
                console.log(error);
                return reject(error);
            }
        });
    }
    getEmployees() {
        return new Promise(async (resolve, reject) => {
            try {
                const employees = await this.db.collection("employees").find({
                    'age' : { '$gt' : 26 }
                }).toArray();
                return resolve(employees);
            }catch(error) {
                return reject(error);
            }
        });
    }
    getUsersWithAgeAndLastName(lastName, age) {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await this.db.collection("users").find({
                    '$and' : [
                        { 'last_name' : lastName },
                        { 'age' : age }
                    ]
                }).toArray();
                return resolve(users);
            } catch (error) {
                return reject(error);
            }
        });
    }
    insertOneDocument(collectionName, item) {
        return new Promise(async (resolve, reject) => {
            try {
                const insertionResult = await this.db.collection(collectionName).insertOne(item);
                return resolve(insertionResult);
            }catch(error) {
                return reject(error);
            }
        });
    }
    updateUserById(id, item) {
        return new Promise(async(resolve, reject) => {
            try {
                const updateResult = await this.db.collection("users").updateOne({
                    '_id' : id 
                }, { '$set' : item});
                return resolve(updateResult);
            }catch(err) {
                return reject(err);
            }
        });
    }
    updateUserDoc(criteria, item) {
        return new Promise(async (resolve, reject) => {
            try {
                const updateResult = await this.db.collection("users").updateOne(criteria, { '$set' : item });
                return resolve(updateResult);
            }catch(error) {
                return reject(error);
            }
        });
    }
    updateUserByUnset(criteria, item) {
        return new Promise(async (resolve, reject) => {
            try {
                const updateResult = await this.db.collection("users").updateOne(criteria, { '$unset' : item });
                return resolve(updateResult);
            }catch(error) {
                return reject(error);
            }
        });       
    }
    findUserByMixCriteria(id, age, gender) {
        return new Promise(async (resolve, reject) => {
            try {
                const findResult = await this.db.collection("users").find(
                    { _id : id , 'age' : age }
                ).toArray();
                return resolve(findResult);
            }catch(error) {
                return reject(error);
            }
        });
    }
    updateArrayUserDoc(criteria, item) {
        return new Promise(async (resolve, reject) => {
            try {
                const updateResult = await this.db.collection("users").updateOne(criteria,  item);
                return resolve(updateResult);
            }catch(error) {
                return reject(error);
            }
        }); 
    }
}