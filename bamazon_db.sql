DROP DATABASE IF EXISTS Bamazon_DB;

CREATE DATABASE Bamazon_DB;

use Bamazon_DB;


create table products (
	ItemID integer(25) auto_increment not null,
    ProductName varchar(80) not null,
    DepartmentName varchar(80) not null,
    Price DECIMAL(10,2) not null,
    StockQuanitiy integer(100) not null,
    primary key (ItemID)
);


INSERT INTO products
VALUES (01, "Ducky Shine Mini 2", "Electronics", 99.99, 3);

INSERT INTO products
VALUES (02, "Asus Monitor", "Electronics", 370.00, 5);

INSERT INTO products
VALUES (03, "Gymnastics Wooden Rings", "Fitness", 29.99, 15);

INSERT INTO products
VALUES (04, "Air Frier", "Kitchen & Home", 49.99, 10);

INSERT INTO products
VALUES (05, "Squat Rack", "Fitness", 899.99, 2);

INSERT INTO products
VALUES (06, "Logited G-Pro Mouse", "Electronics", 29.99, 20);

INSERT INTO products
VALUES (07, "Goodle Pixel 3", "Mobile", 899.99, 10);

INSERT INTO products
VALUES (08, "Sennheisser HD 660 S", "Audio", 499.95, 5);

INSERT INTO products
VALUES (09, "Keurig", "Kitchen & Home", 88.99, 9);

INSERT INTO products
VALUES (10, "Sonos Play 1", "Audio", 298.00, 3);
