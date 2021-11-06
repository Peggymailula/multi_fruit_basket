
CREATE TABLE multi_fruit_basket(
id SERIAL PRIMARY KEY NOT NULL,
name TEXT NOT NULL
);

CREATE TABLE fruit_basket_item(
id SERIAL PRIMARY KEY NOT NULL,
fruitType TEXT NOT NULL,
qty INT NOT NULL,
price FLOAT NOT NULL,
multi_fruit_basket_id INT,
FOREIGN KEY (multi_fruit_basket_id) REFERENCES  multi_fruit_basket(id)
);

CREATE TABLE fruit_basket_item(
id SERIAL PRIMARY KEY NOT NULL,
fruitType TEXT NOT NULL,
qty INT NOT NULL,
price FLOAT NOT NULL,
multi_fruit_basket_id INT,
FOREIGN KEY (multi_fruit_basket_id) REFERENCES  multi_fruit_basket(id)
);

INSERT INTO multi_fruit_basket(name) VALUES('citrus'); 
INSERT INTO multi_fruit_basket(name) VALUES('stone_fruit');
INSERT INTO multi_fruit_basket(name) VALUES('tropical');
INSERT INTO multi_fruit_basket(name) VALUES('berries');

