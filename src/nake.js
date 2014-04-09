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

  var findClosestNakefile = function (path) {
    var nakefile = new File(path + "/Nakefile");
    if (nakefile.exists()) {
      return nakefile;
    }
    var parent = new File(path).getParentFile();
    if (!parent) {
      return undefined;
    }
    return findClosestNakefile(parent.getAbsolutePath());
  };

  var nakefile = findClosestNakefile(global.path);

  if (!nakefile) {
    fatalError("no Nakefile found for directory: ${global.path}");
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


  var args = $ARG;

  if (args.length == 0) {
    printTasks();
    exit(0);
  }

  var taskName = args[0];
  var options = [];
  if (args.length > 1) {
    options = args.slice(1);
  }
  var currentTask = tasks[taskName];
  if (!currentTask) {
    fatalError("no such task: ${taskName}\nuse 'nake' to list all available tasks");
  }

  try {
    currentTask.action.call(global, options);
  }
  catch (e) {
    fatalError("execution of task ${currentTask.name} failed: ${e}");
  }

})();
