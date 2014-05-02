#!/usr/bin/jjs -scripting


// tasks will be run in this context
var global = this;


// local scope for nake internal stuff
(function() {

  // adds support for chaining cli-based operations
  var ShellContext = function(dir) {
    this.pwd = $ENV["PWD"];
    this.cmd = "";
    this.err = "";
    this.out = "";
    this.outs = {};

    this.exec = function(cmd, input) {
      this.checkError();

      $ENV["PWD"] = this.pwd;

      if (typeof cmd == "function") {
        cmd.call(this, this.out, this.pwd);
        return this;
      }

      if (input) {
        this.out = $EXEC(cmd, input);
      } else {
        this.out = $EXEC(cmd);
      }

      this.err = $ERR;
      this.cmd = cmd;
      return this;
    };

    this.pipe = function(cmd, key) {
      this.checkError();
      if (key) {
        return this.exec(cmd, this.outs[key]);
      } else {
        return this.exec(cmd, this.out);
      }
    };

    this.stash = function(key) {
      this.checkError();
      this.outs[key] = this.out;
      return this;
    };

    this.unstash = function(key) {
      this.checkError();
      this.out = this.outs[key];
      return this;
    };

    this.dir = function(dir) {
      this.checkError();
      this.pwd = dir;
      return this;
    };

    this.eachLine = function(fn) {
      this.checkError();
      var lines = this.out.trim().split("\n");
      var i = 0;
      for each (var line in lines) {
        fn.call(this, line, i);
        i++;
      }
      return this;
    };

    this.print = function(msg) {
      this.checkError();
      if (msg) {
        print(msg);
      } else {
        print(this.result());
      }
      return this;
    };

    this.readLine = function(msg) {
      this.checkError();
      this.out = readLine("${msg} ");
      return this;
    };

    this.result = function(key) {
      this.checkError();
      if (key) {
        return this.outs[key].trim();
      }
      return this.out.trim();
    }

    this.checkError = function() {
      if (this.err) {
        throw "failed to execute command '${this.cmd}'\n${$ERR}";
      }
    };

    if (dir) {
      this.dir(dir);
    }
  };

  global.shell = function(dir) {
    return new ShellContext(dir);
  };


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
      global.name = currentTask.name;
      global.description = currentTask.description;
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
    global.name = currentTask.name;
    global.description = currentTask.description;
    currentTask.action.call(global, taskArgs);
  } catch (e) {
    fatalError("Task '${currentTask.name}' failed: ${e}");
  }

})();
