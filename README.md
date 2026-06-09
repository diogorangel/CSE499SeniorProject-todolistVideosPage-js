# Overview CSE 499 Senior Project- Web-Based To-Do List and Web View Exercises Video

# Author : Diogo Rangel Dos Santos (@_diogorangel)
## Overview
# Task Card Manager and Videos Page Tasks - WebApp (Java Edition Including Node.js, SQL and others)

## 📌 Overview
This project is a full-stack Task Management application developed as part of a technical module focused on **Software Engineering and Web Development**. Originally conceived in Node.js, the application was transitioned to a **Java (Spring Boot)** architecture to implement a robust WebApp service integrated with a relational database.

## 🚀 Technologies Used
- **Backend:** Java 17 with Spring Boot Framework.
- **Frontend:** Vanilla JavaScript (ES6+), HTML5, and CSS3.
- **Database:** SQLite (Relational Schema).
- **Build Tool:** Maven.
- **ORM:** Spring Data JPA (Hibernate).

## 🛠️ Key Features & Requirements
- **Web Service:** RESTful API implementation for Task CRUD (Create, Read, Update, Delete).
- **Relational Data:** Integration with SQLite using Foreign Keys for User-Task relationships.
- **Interactive UI:** Dynamic card rendering using JavaScript loops.
- **User Validation:** Conditional logic for task deletion (Confirmation Dialog) and form validation.
- **Clean Code:** Use of Lombok to reduce boilerplate code and maintain modularity.

## 📥 How to Run
1. Ensure you have **JDK 17** and **Maven** installed.
2. Clone the repository.
## 📥 How to Run
1. Ensure you have **JDK 17** and **Maven** installed.
2. Clone the repository.
3. Do the follow command with the terminal integrted with project-todolist-js:
* mvn install
* npm install

4. Run the application using the Maven Wrapper:
   * mvn spring-boot:run


## Software Demo Video
* [Link of website live](https://cse499seniorproject-todolistvideospage-js.onrender.com/Todolist.html)
* [Local Link](http://localhost:8080/Todolist.html)
* [Link to your YouTube/Loom video here](https://www.loom.com/share/6585d9bfb219457687a50700a9fbee08)

5. Others commands mvn:
### Spring Boot Commands

* **Run the application locally:**
  ```mvn spring-boot:run```
* **Run with a specific profile (ex: dev, prod):**
  ```mvn spring-boot:run -Dspring-boot.run.profiles=dev ```
* **Run with command line arguments:**
  ```mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8081"```
* **Build a Docker image of the application (Buildpacks):**
  ```mvn spring-boot:build-image```

### Build Lifecycle (Maven)

| Command | Description |
| :--- | :--- |
| `mvn clean` | Cleans the `target` folder (removes previous builds). |
| `mvn compile` | Compiles the project source code. |
| `mvn test` | Runs unit tests. |
| `mvn package` | Packages the application into an executable `.jar`. |
| `mvn install` | Installs the generated package into your local repository (`.m2`). |

### Common Combinations

* **Clean full build:**
  ```mvn clean install```
* **Generate executable JAR skipping tests:**
  ```mvn clean package -DskipTests```

### Dependency Management

* **View dependency tree (to resolve conflicts):**
  ```mvn dependency:tree```
* **Force update dependencies:**
  ```mvn clean install -U```
   


## Development Environment
* Language: JavaScript (Vanilla)
* Tools: Visual Studio Code, Google Chrome DevTools

## Useful Websites
* [MDN Web Docs - Element.classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)
* [JavaScript.info - DOM Nodes](https://javascript.info/dom-nodes)

## Future Work
* Add "Local Storage" so tasks stay even after refreshing the page.
* Add a "Clear All" button.
* Implement task categories (Work, Personal, etc.).


## Favorite quote Diogo Rangel
* I am I in circustances. If I don't save them, I cannot save myself- José Y Ortega
* Moses 1:13,17 (...)"thou? For behold, I am a son of God, in the similitude of his Only Begotten; and where is thy glory, that I should worship thee?(...)he also gave me commandments when he called unto me out of the burning bush, saying: Call upon God in the name of mine Only Begotten, and worship me."

