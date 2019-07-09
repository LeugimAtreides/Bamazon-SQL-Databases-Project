use bamazon;

/* drop table products;
drop table users; */

replace into products (product_name, department_name, price, stock_quantity) values
('Baby Stroller', 'Child-care', 140.99, 69),
('Automatic Can-Opener', 'Kitchen', 15.99, 89),
('Purina Dog-Chow 3lb', 'Pets', 17.99, 45),
('Chicken Breast 6-pack', 'Food and Drink', 22.99, 58),
('Playstation 4', 'Video games',350.80, 34),
('XBOX ONE X', 'Video games', 374.99, 59),
('iPhone X', 'Phones', 678.00, 20),
('Bananas', 'Food and Drink', 1.60, 200),
('Throw Blanket', 'Apparel', 11.99, 139),
('Rawhide Dog Bone', 'Pets', 7.99, 300);

replace into users (name, username, password) values
('Miguel Villarreal','mvillarreal789', 'Venom1215!');

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Video Games", 200),
  ("Food and Drink", 100),
  ("Apparel", 50),
  ("Necessities", 300),
  ("Films", 35),
  ("Board Games", 0);


SELECT * FROM users;
select * from products;