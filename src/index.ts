import { TodoItem } from "./todoItem.js";
import { TodoCollection } from "./todoCollection.js";
import inquirer from "inquirer";
import { JsonTodoCollection } from "./jsonTodoCollection.js";

let todos: TodoItem[] = [
  new TodoItem(1, "Buy Flowers"),
  new TodoItem(2, "Get Shoes"),
  new TodoItem(3, "Collect Tickets"),
  new TodoItem(4, "Call Joe", true),
];
let collection: TodoCollection = new JsonTodoCollection("Paul", todos);
let showCompleted = true;

/**
 * Displays the todo list with the user's name and the number of incomplete items.
 */
function displayTodoList(): void {
  console.log(`${collection.userName}'s Todo List `
    + `(${collection.getItemCounts().incomplete} items to do)`);
  collection.getTodoItems(showCompleted).forEach(item => item.printDetails());
}

/**
 * Represents the available commands in the application.
 */
enum Commands {
  Add = "Add New Task",
  Complete = "Complete Task",
  Toggle = "Show/Hide Completed",
  Purge = "Remove Completed Tasks",
  Quit = "Quit"
}

/**
 * Prompts the user to enter a task and adds it to the collection.
 */
function promptAdd(): void {
  console.clear();
  inquirer.prompt({ type: "input", name: "add", message: "Enter task:" })
    .then(answers => {
      if (answers["add"] !== "") {
        collection.addTodo(answers["add"]);
      }
      promptUser();
    });
}

/**
 * Displays the todo list and prompts the user to mark tasks as complete.
 */
function promptComplete(): void {
  console.clear();
  displayTodoList();
  inquirer.prompt({
    type: "checkbox",
    name: "complete",
    message: "Mark Tasks Complete",
    choices: collection.getTodoItems(showCompleted).map(item =>
      ({ name: item.task, value: item.id, checked: item.complete }))
  }).then(answers => {
    let completedTasks = answers["complete"] as number[];
    collection.getTodoItems(true).forEach(item =>
      collection.markComplete(item.id, completedTasks.find(id => id === item.id) != undefined));
    promptUser();
  });
}

/**
 * Prompts the user to choose an option and performs the corresponding action.
 */
function promptUser(): void {
  console.clear();
  displayTodoList();
  inquirer.prompt({
    type: "list",
    name: "command",
    message: "Choose option", 
    choices: Object.values(Commands)
  }).then(answers => {
    switch (answers["command"]) {
      case Commands.Add:
        promptAdd();
        break;
      case Commands.Complete:
        if (collection.getItemCounts().incomplete > 0) {
          promptComplete();
        } else {
          promptUser();
        }
        break;
      case Commands.Toggle:
        showCompleted = !showCompleted;
        promptUser();
        break;
      case Commands.Purge:
        collection.removeComplete();
        promptUser();
        break;
    }
  });
}

promptUser();
