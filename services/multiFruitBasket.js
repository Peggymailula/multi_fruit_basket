module.exports = (pool) =>  {
//Citrus:  oranges, grapefruits and lemon.
// Stone fruit – nectarines, apricots, peaches and plums.
// Tropical  – bananas and mangoes.
// Berries – strawberries, raspberries, blueberries,


    async function newBasket(type,qty,price){
        let basketName;
    if(type=== 'orange' || type=== 'grapefruit' ||type === 'lemon'){
      basketName = 'citrus';
        
    }
    
   else if(type=== 'apricot' || type=== 'peach' ||type === 'plum'){     
        basketName = 'stone_fruit'; 
    }
    if(type=== 'banana' || type=== 'mango'){
        basketName = 'tropical';
          
      }
    else if(type=== 'strawberry' || type=== 'raspberry' ||type === 'blueberry'){   
        basketName = 'berries';    
    }
  


    let basketID = await pool.query('SELECT id FROM multi_fruit_basket WHERE name = $1',[basketName]); 

    const id  = basketID.rows[0].id;
   

    await pool.query('INSERT INTO fruit_basket_item (fruitType, qty,price,multi_fruit_basket_id) VALUES ($1,$2,$3,$4)',[type,qty, price,id]); 

     
    }
    async function getFruit(fruit){
        const fruits =   await pool.query('SELECT * FROM fruit_basket_item WHERE fruitType = $1',[fruit]);
        return fruits.rows;
      }

       async function addFruit(newFruit){
      
       var noDuplicate = await pool.query('SELECT fruitType FROM fruit_basket_item WHERE fruitType = $1', [newFruit]);

       if (noDuplicate.rowCount !== 0) {

        await pool.query('UPDATE fruit_basket_item SET  qty= qty + 1 WHERE fruitType = $1', [newFruit]);
       }
    }
    async function removeFruit(newFruit){
      
        let noDuplicate = await pool.query('SELECT fruitType FROM fruit_basket_item WHERE fruitType = $1', [newFruit]);
      
 
        if (noDuplicate.rowCount !== 0) {
 
         await pool.query('UPDATE fruit_basket_item SET  qty = qty-1 WHERE fruitType = $1', [newFruit]);
        }

        await pool.query('DELETE FROM fruit_basket_item WHERE qty = 0')

    
        
     }
 

   async function getBasket(id){
 
   //const bastket = await pool.query('SELECT multi_fruit_basket.name, fruit_basket_item.fruitType FROM fruit_basket_item INNER JOIN multi_fruit_basket ON multi_fruit_basket.id = fruit_basket_item.multi_fruit_basket_id AND fruit_basket_item.multi_fruit_basket_id = $1',[id]);
   let basket = await pool.query('SELECT name FROM multi_fruit_basket WHERE id = $1',[id]);
    //basket = basket.rows;

    let basketName = basket.rows[0].name;
    
   let allFruit =  await pool.query('SELECT fruitType,qty FROM fruit_basket_item  WHERE multi_fruit_basket_id  = $1',[id]);
     allFruit =  allFruit.rows;   

     let fruit = allFruit.map(function (obj) {
       return  obj.fruittype;
     });

     let qty = allFruit.map(function (obj) {
      return  obj.qty;
    });
    let baskets ={}
    if(qty.length !==0){
     baskets = {
        'id': id,
        'basket_name':basketName,
        'fruits_in_basket': fruit,
        'quantity':qty
      }

    }
    else{
      baskets = {};
    }

  return baskets;

   }

  //  async function getQuantity(){

  //  }

  //  async function getPrice(){

  //  }

   async function getTotalCost(name){

    let nameId =  await pool.query('SELECT id FROM multi_fruit_basket WHERE name=$1',[name]);
     nameId= nameId.rows[0].id;

     let totalqty = await pool.query('SELECT SUM(qty) FROM fruit_basket_item WHERE multi_fruit_basket_id=$1',[nameId]);
     totalqty= totalqty.rows[0].sum;

     let totalPrice = await pool.query('SELECT SUM(price) FROM fruit_basket_item WHERE multi_fruit_basket_id=$1',[nameId]);
     totalPrice= totalPrice.rows[0].sum;

     return 'R'+( totalqty * totalPrice);
  }

  async function totalCost(id){

    let totalqty = await pool.query('SELECT SUM(qty) FROM fruit_basket_item WHERE multi_fruit_basket_id=$1',[id]);
     totalqty= totalqty.rows[0].sum;

     let totalPrice = await pool.query('SELECT SUM(price) FROM fruit_basket_item WHERE multi_fruit_basket_id=$1',[id]);
     totalPrice= totalPrice.rows[0].sum;

     return 'R'+( totalqty * totalPrice);
  

  }

   
    return {
        newBasket,
        removeFruit,
        addFruit,
        getFruit,
       getBasket,
        getTotalCost,
        totalCost
       
    }
}