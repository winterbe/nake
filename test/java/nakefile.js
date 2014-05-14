task("watch", "Watch and recompile java files", function () {
  var Paths = Java.type("java.nio.file.Paths");
  var Files = Java.type("java.nio.file.Files");
  var FileSystems = Java.type("java.nio.file.FileSystems");
  var SimpleFileVisitor = Java.type("java.nio.file.SimpleFileVisitor");
  var FileVisitResult = Java.type("java.nio.file.FileVisitResult");
  var Events = Java.type("java.nio.file.StandardWatchEventKinds");

  var src = Paths.get(projectDir + "/src");
  var watcher = FileSystems.getDefault().newWatchService();
  var Visitor = Java.extend(SimpleFileVisitor);
  Files.walkFileTree(src, new Visitor() {
    preVisitDirectory: function (dir) {
      dir.register(watcher, Events.ENTRY_CREATE, Events.ENTRY_DELETE, Events.ENTRY_MODIFY);
      return FileVisitResult.CONTINUE;
    }
  });

  print("watching ${src} for recompile...");

  while (true) {
    var watchKey = watcher.take();
    var events = watchKey.pollEvents();
    for each (var event in events) {
      var changedPath = event.context();
      print("changedPath=${changedPath}");
      if (String(changedPath).indexOf(".java") > -1) {
        run('compile');
      }
    }
    watchKey.reset();
  }
});

task("compile", "Compile all java files", function() {
  shell()
    .exec("find src -name *.java")
    .apply(function(result) {
      var paths = result.split("\n");
      return java.lang.String.join(" ", paths);
    })
    .stash("files")
    .print("compiling java files...")
    .exec("mkdir -p out")
    .exec("javac -d out {{files}}")
    .print("done");
});

task("run", "Run java application", function(options) {
  shell("out")
    .exec("java com/winterbe/nake/java/Main ${options[0]}")
    .print();
});
