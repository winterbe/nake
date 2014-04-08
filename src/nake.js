#!/usr/bin/jjs -scripting

var global = this;

(function() {
  var File = Java.type("java.io.File");

  var fatalError = function (message) {
    print(message);
    exit(1);
  };


  $EXEC("pwd");

  global.path = $OUT.trim();

  var nakefile = new File(global.path + "/Nakefile");

  if (!nakefile.exists()) {
    fatalError("Nakefile not found: ${global.path}");
  }

  var tasks = {};

  var task = function(name, description, action) {
    tasks[name] = {
      name: name,
      description: description,
      action: action
    };
  };

  global.task = task;

  var printTasks = function() {
    print("Tasks defined in ${global.path}/Nakefile:");
    for (var taskName in tasks) {
      var task = tasks[taskName];
      print(" - ${task.name} [${task.description}]");
    }
    print("\nuse 'nake -- taskName' to execute a task");
  };


  // evaluate Nakefile
  load(nakefile.getAbsolutePath());


  if (global.arguments.length == 0) {
    printTasks();
    exit(0);
  }

  var taskName = global.arguments[0];
  var currentTask = tasks[taskName];
  if (!currentTask) {
    fatalError("no such task: ${taskName}\nuse 'nake' to list all available tasks");
  }

  try {
    currentTask.action.call(global);
  }
  catch (e) {
    fatalError("failed to execute task ${currentTask.name}: ${e}");
  }

})();
