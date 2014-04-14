#!/usr/bin/jjs -scripting


// tasks will be run in this context
var global = this;


// local scope for nake internal stuff
(function() {
  var File = Java.type("java.io.File");

  var fatalError = function (message) {
    print(message);
    exit(1);
  };


  global.path = $ENV['PWD'];

  // find nearest Nakefile for current directory
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

  // register a task by name
  var task = function(name, description, action) {
    tasks[name] = {
      name: name,
      description: description,
      action: action
    };
  };

  global.task = task;


  // run a specific task by name
  var run = function (name, taskArgs) {
    var currentTask = tasks[name];
    if (!currentTask) {
      fatalError("no such task: ${taskName}\nuse 'nake' to list all available tasks");
    }
    try {
      currentTask.action.call(global, taskArgs);
    }
    catch (e) {
      fatalError("execution of task ${currentTask.name} failed: ${e}");
    }
  };

  global.run = run;


  var printTasks = function() {
    print("Tasks defined in ${global.path}/Nakefile\n");
    var length = 0;
    for (var taskName in tasks) {
      if (taskName.length() > length) {
        length = taskName.length();
      }
    }

    for each (var task in tasks) {
      var name = task.name;
      while (name.length() < length) {
        name += " ";
      }
      var line = "   ${name}   ${task.description}";
      print(line);
    }

    print("\nuse 'nake -- taskName' to run a specific task");
  };


  // evaluate Nakefile
  load(nakefile.getAbsolutePath());


  var args = $ARG;

  if (args.length === 0) {
    printTasks();
    exit(0);
  }

  var taskName = args[0];
  var taskArgs = [];
  if (args.length > 1) {
    taskArgs = args.slice(1);
  }
  var currentTask = tasks[taskName];
  if (!currentTask) {
    fatalError("no such task: ${taskName}\nuse 'nake' to list all available tasks");
  }

  // call task with global context
  try {
    currentTask.action.call(global, taskArgs);
  }
  catch (e) {
    fatalError("execution of task ${currentTask.name} failed: ${e}");
  }

})();
