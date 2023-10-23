import should from 'should'
import {config} from 'dotenv'
import {Db} from '../src/db.js'

describe('Mongodb CRUD Operation', function() {
    this.timeout(1597206900);
    config();
    let id;
    const db = new Db();
    before(async () => {
        await db.connect();
        await db.innit();
    });
    after(async () => {
        await db.disconnect();
    });
    describe('update existing document' , function() {
        it('update age of an user successfully' , async () => {
            try {
                const result = await db.insertOneDocument("users", {
                    'first_name' : 'test_first_name',
                    'last_name' : 'test_last_name',
                    'age': 20,
                    'gender': 'male',
                    'created_at' : Date.now(),
                    'modified_at' : Date.now()
                });
                should(result.acknowledged === true);
                should(result.insertedId).be.not.null().and.not.undefined();
                id = result.insertedId;
                const updateResult = await db.updateUserById(id, { 'age' : 31 });
                should(updateResult.acknowledged).be.equal(true);
                should(updateResult.modifiedCount).be.equal(1);
                should(updateResult.matchedCount).be.equal(1);
            } catch (error) {
                should.not.exists(error);
            }
        });
        it('update an user\'s first name successfully' , async () => {
            try {
                const updateResult = await db.updateUserById(id, { 'first_name' : 'test2_first_name' });
                should(updateResult.acknowledged).be.equal(true);
                should(updateResult.modifiedCount).be.equal(1);
                should(updateResult.matchedCount).be.equal(1);
            } catch (error) {
                should.not.exists(error);
            }
        });
        it('update an user\'s last name successfully' , async () => {
            try {
                const updateResult = await db.updateUserDoc({ 'age' :  31 }, { 'last_name' : 'test2_last_name' });
                should(updateResult.acknowledged).be.equal(true);
                should(updateResult.modifiedCount).be.equal(1);
                should(updateResult.matchedCount).be.equal(1);
            } catch (error) {
                should.not.exists(error);
            }
        });
        it('update an user\'s gender and age successfully' , async () => {
            try {
                const updateResult = await db.updateUserDoc({ '$and' : [ {'_id' : id } , {'gender' : 'male'}, {'age' : 31 }] }, { 'age' : 30 , 'gender' : 'female' });
                should(updateResult.acknowledged).be.equal(true);
                should(updateResult.modifiedCount).be.equal(1);
                should(updateResult.matchedCount).be.equal(1);
            } catch (error) {
                should.not.exists(error);
            }
        });
        it('update an user by adding profile successfully' , async () => {
            try {
                const updateResult = await db.updateUserDoc({ '$and' : [ {'_id' : id } , {'gender' : 'female'}, {'age' : 30 }] }, { 'profile' : { 'email' : 'test@test.com' } });
                should(updateResult.acknowledged).be.equal(true);
                should(updateResult.modifiedCount).be.equal(1);
                should(updateResult.matchedCount).be.equal(1);
            } catch (error) {
                should.not.exists(error);
            }
        });

        it('update an user by adding array of favorites movies successfully' , async () => {
            try {
                const updateResult = await db.updateUserDoc({ 'profile.email' : 'test@test.com' }, { 'favorites' : { 'movies' : ['Casablanca', 'For a Few Dollars More', 'The Sting'] } });
                should(updateResult.acknowledged).be.equal(true);
                should(updateResult.modifiedCount).be.equal(1);
                should(updateResult.matchedCount).be.equal(1);
            } catch (error) {
                should.not.exists(error);
            }
        });
        
        it('update an user\'s favorites movies by adding new movie successfully' , async () => {
            try {
                const updateResult = await db.updateArrayUserDoc({ 'favorites.movies' : 'Casablanca' }, { '$addToSet' : { 'favorites.movies' : 'The Maltese Falcon' } });
                should(updateResult.acknowledged).be.equal(true);
                should(updateResult.modifiedCount).be.equal(1);
                should(updateResult.matchedCount).be.equal(1);
            } catch (error) {
                should.not.exists(error);
            }
        });

        it('update an user by deleting profile successfully' , async () => {
            try {
                const updateResult = await db.updateUserByUnset({ '$and' : [ {'_id' : id } , {'gender' : 'female'}, {'age' : 30 }] }, { 'profile' : 1 });
                should(updateResult.acknowledged).be.equal(true);
                should(updateResult.modifiedCount).be.equal(1);
                should(updateResult.matchedCount).be.equal(1);
            } catch (error) {
                should.not.exists(error);
            }
        });
    });
});