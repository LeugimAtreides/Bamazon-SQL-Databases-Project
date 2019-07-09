drop database if exists bamazon;

create database bamazon;

use bamazon;

create table products (
    item_id int not null auto_increment,
    product_name varchar(255) null,
    department_name varchar(255) null,
    price DECIMAL(10,2) null,
    stock_quantity smallint null,
    primary key (item_id)
);

create table users (
    user_id int not null auto_increment,
    name varchar(255) not null,
    username varchar(255) not null,
    password varchar(255) not null,
    primary key (user_id)
);

 CREATE TABLE departments(
  department_id INT AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  over_head_costs DECIMAL(10,2) NOT NULL,
  primary key(department_id)
);