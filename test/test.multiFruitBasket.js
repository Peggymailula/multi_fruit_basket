let assert = require("assert");
let TheFruitBasket = require("../services/multiFruitBasket");
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/multifruitbasket_test';

const pool = new Pool({
    connectionString
});

describe('Multiple fruits in a basket', function () {


    beforeEach(async function () {
        // clean the tables before each test run
        await pool.query('delete from fruit_basket_item;');
      
    });

    it('should create and return the first basket id of one that contains citrus fruit(orange,grapefruit,lemon) and their respective quantities', async function () {
        

      const fruitB = TheFruitBasket(pool);
       await fruitB.newBasket('orange',4,4.00);
       await fruitB.newBasket('grapefruit',5,4.50);
       await fruitB.newBasket('lemon',2,3.50);
   
 
      assert.deepEqual(
        {
          id: 1,
          basket_name: 'citrus',
          fruits_in_basket: [ 'orange', 'grapefruit', 'lemon' ],
          quantity: [ 4, 5, 2 ]
        }
        
          ,await fruitB.getBasket(1));

   });

     it('should create and return the basket id of three that contains tropical fruit(peach and plum)', async function () {
        

      const fruitB = TheFruitBasket(pool);
       await fruitB.newBasket('peach',5,4.00);
       await fruitB.newBasket('plum',8,4.50);
       await fruitB.newBasket('lemon',7,3.50);
       await fruitB.newBasket('orange',2,4.00);
       await fruitB.newBasket('grapefruit',1,4.50);
   
       assert.deepEqual(
        {
          id: 2,
          basket_name: 'stone_fruit',
          fruits_in_basket: [ 'peach', 'plum'],
          quantity: [ 5, 8]
        }
        
          ,await fruitB.getBasket(2));
   });


   it('should add two more bananas to tropical fruit basket and return the new basket with updated contents', async function () {
        

    const fruitB = TheFruitBasket(pool);
     await fruitB.newBasket('plum',1,4.00);
     await fruitB.newBasket('plum',1,4.00);
     await fruitB.newBasket('banana',2,4.50);
     await fruitB.newBasket('mango',6,3.50);
     await fruitB.newBasket('orange',2,4.00);
     await fruitB.newBasket('grapefruit',2,4.50);

     await fruitB.addFruit('banana');
     await fruitB.addFruit('banana');
     
    // console.log(await fruitB.getBasket(3));
   
     assert.deepEqual(
      {
        id: 3,
        basket_name: 'tropical',
        fruits_in_basket: [ 'mango', 'banana'],
        quantity: [ 6, 4]
      }
      
        ,await fruitB.getBasket(3));
 });

 it('should add five strawberries to the berries basket ', async function () {
        

  const fruitB = TheFruitBasket(pool);
  await fruitB.newBasket('strawberry',2,3.50);
  await fruitB.newBasket('mango',6,3.50);
  


   
   await fruitB.addFruit('strawberry');
   await fruitB.addFruit('strawberry');
   await fruitB.addFruit('strawberry');
   await fruitB.addFruit('strawberry');
   await fruitB.addFruit('strawberry');
   
 
   assert.deepEqual(
    {
      id: 4,
      basket_name: 'berries',
      fruits_in_basket: [ 'strawberry'],
      quantity: [ 7]
    }
    
      ,await fruitB.getBasket(4));
});

it('should remove two strawberries to the berries basket ', async function () {
        

  const fruitB = TheFruitBasket(pool);
  await fruitB.newBasket('strawberry',5,3.50);
  await fruitB.newBasket('mango',6,3.50);

   await fruitB.removeFruit('strawberry');
   await fruitB.removeFruit('strawberry');

   assert.deepEqual(
    {
      id: 4,
      basket_name: 'berries',
      fruits_in_basket: [ 'strawberry'],
      quantity: [3]
    }
    
      ,await fruitB.getBasket(4));
});

it('should remove all the citrus fruit from the baskets and remove the basket itself', async function () {
        

  const fruitB = TheFruitBasket(pool);
  await fruitB.newBasket('plum',1,4.00);
  await fruitB.newBasket('plum',1,4.00);
  await fruitB.newBasket('banana',2,4.50);
  await fruitB.newBasket('mango',6,3.50);
  await fruitB.newBasket('orange',3,4.00);
  await fruitB.newBasket('grapefruit',2,4.50);


   await fruitB.removeFruit('orange');
   await fruitB.removeFruit('orange');
   await fruitB.removeFruit('orange');
   await fruitB.removeFruit('grapefruit');
   await fruitB.removeFruit('grapefruit');
  


   assert.deepEqual(
   {} ,await fruitB.getBasket(1));
});
    
it('should return the total cost (R132) of the citrus basket using basket name', async function () {
        

  const fruitB = TheFruitBasket(pool);
   await fruitB.newBasket('orange',4,4.00);
   await fruitB.newBasket('grapefruit',5,4.50);
   await fruitB.newBasket('lemon',2,3.50);

  assert.equal('R132',await fruitB.getTotalCost('citrus'));

});

it('should return the total cost of stone fruit basket in Rands(149.5) using basket name', async function () {
        

  const fruitB = TheFruitBasket(pool);
   await fruitB.newBasket('plum',3,4.00);
   await fruitB.newBasket('apricot',4,4,3.60);
   await fruitB.newBasket('banana',2,4.50);
   await fruitB.newBasket('peach',6,3.50);
   await fruitB.newBasket('orange',2,4.00);
   await fruitB.newBasket('grapefruit',2,4.50);

   assert.deepEqual('R149.5' ,await fruitB.getTotalCost('stone_fruit'));
});

it('should return the total cost (R132) of the citrus basket using basket id', async function () {
        

  const fruitB = TheFruitBasket(pool);
   await fruitB.newBasket('orange',4,4.00);
   await fruitB.newBasket('grapefruit',5,4.50);
   await fruitB.newBasket('lemon',2,3.50);

  assert.equal('R132',await fruitB.totalCost(1));

});

it('should return the total cost of stone fruit basket in Rands(149.5) using basket id', async function () {
        

  const fruitB = TheFruitBasket(pool);
   await fruitB.newBasket('plum',3,4.00);
   await fruitB.newBasket('apricot',4,4,3.60);
   await fruitB.newBasket('banana',2,4.50);
   await fruitB.newBasket('peach',6,3.50);
   await fruitB.newBasket('orange',2,4.00);
   await fruitB.newBasket('grapefruit',2,4.50);

   assert.deepEqual('R149.5' ,await fruitB.totalCost(2));
});



    after(function () {
        pool.end();
    })
});