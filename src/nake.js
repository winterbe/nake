#!/usr/bin/jjs -scripting


// tasks will be run in this context
var global = this;


// local scope for nake internal stuff
(function() {

  var File = Java.type("java.io.File");


  // shell api adds support for chaining cli-based operations
  var Shell = function(dir) {
    this.out = "";
    this.err = "";
    this.stashed = {};
    this.pwd = global.projectDir;
    this.showErrors = false;


    // interpolate stashed values with pattern: {{key}}
    var interpolate = function(text) {
      if (text.contains("{{")) {
        var matches = text.match(interpolate.PATTERN);
        for each (var match in matches) {
          var key = match.replace("{{", "").replace("}}", "");
          if (key) {
            var val = this.stashed[key];
            text = text.replace(match, val);
          } else {
            text = text.replace(match, this.out);
          }
        }
      }
      return text;
    };

    interpolate.PATTERN = /\{\{(.*?)\}\}/g;


    this.exec = function(cmd, input) {
      $ENV["PWD"] = this.pwd;

      if (typeof cmd == "function") {
        cmd.call(this, this.out);
        return this;
      }

      cmd = interpolate.call(this, cmd);

      if (input) {
        $EXEC(cmd, input);
      } else {
        $EXEC(cmd);
      }

      this.out = $OUT.trim();
      this.err = $ERR.trim();

      if (this.showErrors && this.err) {
        print(this.err);
      }

      if ($EXIT > 0) {
        throw "failed to execute command '${cmd}' (EXIT=${$EXIT})";
      }

      return this;
    };

    this.pipe = function(cmd, key) {
      if (key) {
        return this.exec(cmd, this.stashed[key]);
      } else {
        return this.exec(cmd, this.out);
      }
    };

    this.stash = function(key) {
      this.stashed[key] = this.out;
      return this;
    };

    this.unstash = function(key) {
      this.out = this.stashed[key];
      return this;
    };

    this.dir = function(dir) {
      if (dir.indexOf(File.separator) == 0) {
        this.pwd = dir;
        return this;
      }

      var pathTokens = dir.split(File.separator);
      for each (var token in pathTokens) {
        if (token == "..") {
          var idx = this.pwd.lastIndexOf(File.separator);
          this.pwd = this.pwd.slice(0, idx);
        } else {
          this.pwd = this.pwd + File.separator + token;
        }
      }

      return this;
    };

    this.eachLine = function(fn) {
      var lines = this.out.split("\n");
      var i = 0;
      for each (var line in lines) {
        fn.call(this, line, i);
        i++;
      }
      return this;
    };

    this.apply = function(fn, key) {
      if (key === undefined) {
        this.out = fn.call(this, this.out);
      } else {
        this.stashed[key] = fn.call(this, this.stashed[key]);
      }
      return this;
    };

    this.print = function(msg) {
      if (msg === undefined) {
        print(this.get());
      } else {
        msg = interpolate.call(this, msg);
        print(msg);
      }
      return this;
    };

    this.prompt = function(msg) {
      msg = interpolate.call(this, msg);
      this.out = readLine("${msg} ");
      return this;
    };

    this.showErr = function(showErrors) {
      this.showErrors = showErrors === undefined || !!(showErrors);
      return this;
    };

    this.stashErr = function(key) {
      if (key === undefined) {
        this.out = this.err;
      } else {
        this.stashed[key] = this.err;
      }
      return this;
    };

    this.get = function(key) {
      if (key) {
        return this.stashed[key];
      }
      return this.out;
    };

    this.set = function() {
      if (!arguments.length) {
        return this;
      }

      if (arguments.length == 2) {
        var key = arguments[0];
        var val = arguments[1];
        this.stashed[key] = val;
        return this;
      }

      this.out = arguments[0];
      return this;
    };

    if (dir) {
      this.dir(dir);
    }
  };

  global.shell = function(dir) {
    return new Shell(dir);
  };


  var fatalError = function (message, e) {
    print(message);
    if (e) e.printStackTrace();
    exit(1);
  };


  var validFileNames = ["Nakefile", "nakefile", "Nakefile.js", "nakefile.js"];
  var nakefileName;

  // find nearest Nakefile for current directory
  var findClosestNakefile = function (path) {
    for each (var name in validFileNames) {
      var nakefile = new File(path + File.separator + name);
      if (nakefile.exists()) {
        nakefileName = name;
        return nakefile;
      }
    }

    var parent = new File(path).getParentFile();
    if (!parent) {
      return undefined;
    }
    return findClosestNakefile(parent.getAbsolutePath());
  };

  var nakefile = findClosestNakefile($ENV['PWD']);

  if (!nakefile) {
    fatalError("no Nakefile found for directory: ${$ENV['PWD']}");
  }

  global.projectDir = nakefile.getParent();
  global.currentDir = $ENV['PWD'];


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
    print("Tasks defined in ${global.projectDir}/${nakefileName}\n");
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
    fatalError("Task '${currentTask.name}' failed: ${e}", e);
  }

})();
