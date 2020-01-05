CREATE DATABASE `BooksDB`;


USE `BooksDB`;

CREATE TABLE `Category` (
	`CategoryID`  INT AUTO_INCREMENT,
    `CategoryName` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`CategoryID`)
);
SET SQL_SAFE_UPDATES=0;

-- INSERT INTO Category(CategoryName) VALUES ("Mathematics");
-- DELETE FROM Category
-- WHERE CategoryName='Mathematics';




CREATE TABLE `Books` (
	`BookID` INT NOT NULL AUTO_INCREMENT,
    `BookName` VARCHAR(255) NOT NULL,
    `AuthorName` VARCHAR(255) NOT NULL,
    `CategoryID` INT NOT NULL,
    PRIMARY KEY (BookID),
    CONSTRAINT FK_books_categoryID FOREIGN KEY (CategoryID)
    REFERENCES Category(CategoryID)
);


INSERT INTO Books(BookName, AuthorName, CategoryID)
VALUES("WW2 In Color: Revisiting History", "Pearl Johnson", 12);

CREATE TABLE `Departments` (
	`DeptID` INT NOT NULL AUTO_INCREMENT,
    `DeptName` VARCHAR(127) NOT NULL,
    PRIMARY KEY (DeptID)
);
INSERT INTO Departments(DeptName) VALUES ("Engineering");
INSERT INTO Departments(DeptName) VALUES ("Law");
INSERT INTO Departments(DeptName) VALUES ("Medical");
INSERT INTO Departments(DeptName) VALUES ("Humanities");
INSERT INTO Departments(DeptName) VALUES ("IT");
INSERT INTO Departments(DeptName) VALUES ("Science");
INSERT INTO Departments(DeptName) VALUES ("Commerce");



CREATE TABLE Students (
	`StudentID` INT NOT NULL AUTO_INCREMENT,
    `StudentName` VARCHAR(255) NOT NULL,
    `DeptID` INT NOT NULL,
    `EmailID` VARCHAR(255) DEFAULT '',
    `Address` VARCHAR(255) NOT NULL,
    PRIMARY KEY (StudentID),
    CONSTRAINT FK_Stu_DeptID FOREIGN KEY (DeptID)
    REFERENCES Departments(DeptID) ON DELETE CASCADE
);
INSERT INTO Students(StudentID, StudentName, DeptID, EmailID, Address) VALUES(9400710, "Arijit Pandey", 2, "pandey.arijit62@gmail.com", "243 Kochi Lane, Delhi");

SET GLOBAL FOREIGN_KEY_CHECKS=0;

CREATE TABLE StudentBooks (
    `TransactionID` INT NOT NULL,
    `StudentID` INT NOT NULL,
    `BookID` INT NOT NULL,
    `IssueDate` DATE NOT NULL,
    `ActionType` ENUM ('Issued', 'Returned') NOT NULL,
    PRIMARY KEY (TransactionID),
    CONSTRAINT FK_stud_ID FOREIGN KEY (StudentID)
    REFERENCES Students(StudentID),
    CONSTRAINT FK_Book_ID FOREIGN KEY (BookID)
    REFERENCES Books(BookID)
)


