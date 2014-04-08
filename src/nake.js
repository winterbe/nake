#!/usr/bin/jjs -scripting

var File = Java.type("java.io.File");

$EXEC("pwd");

var path = $OUT.trim() + "/Nakefile";

var nakefile = new File(path);

if (!nakefile.exists()) {
  print('Nakefile does not exist');
  exit();
}

var tasks = {};

var task = function(name, description, action) {
  tasks[name] = {
    name: name,
    description: description,
    action: action
  };
};

var printTasks = function() {
  print('Tasks:');
  for (var task in tasks) {
    print(" - ${task}");
  }
};

// evaluate Nakefile
load(nakefile.getAbsolutePath());

if (arguments.length == 0) {
  printTasks();
  exit(0);
}

var taskName = arguments[0];
var context = tasks[taskName];
if (!context) {
  print("unknown task: ${taskName}");
  exit(1);
}

context.action.call(this);
