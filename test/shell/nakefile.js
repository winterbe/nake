task("basic", "test exec/pipe/print", function() {
  shell(".")
    .exec("ls")
    .print()
    .dir("folder1")
    .exec("ls")
    .print()
    .exec("echo Hi there!")
    .pipe("cat")
    .print();
});

task("exec-fn", "test exec with function", function () {
  shell()
    .exec("ls -al")
    .exec(function (result) {
      print("executing function with result:");
      print(result.trim());
    })
    .print("DONE");
});

task("exec-interpolate", "cmd interpolation", function () {
  shell()
    .set("text", "Hi there!")
    .exec("echo {{text}}")
    .print();
});

task("dir", "test change dir", function () {
  shell()
    .exec("pwd")
    .print()
    .dir("folder1")
    .exec("pwd")
    .print()
    .dir("subfolder1")
    .exec("pwd")
    .dir("/usr/local")
    .exec("pwd")
    .print();
});

task("dir2", "test change .. dir", function() {
  shell("folder1/subfolder1")
    .exec("pwd")
    .print()
    .dir("..")
    .exec("pwd")
    .print()
    .dir("../folder1/subfolder1")
    .exec("pwd")
    .print()
    .dir("../..")
    .exec("pwd")
    .print()
    .dir("folder1/../folder1/subfolder1")
    .exec("pwd")
    .print();
});

task("prompt", "test prompt", function() {
  shell()
    .prompt("Who's there?")
    .print();
});

task("interpolate", "test prompt/print interpolation", function() {
  shell()
    .set("foo", "who")
    .prompt("Who's {{foo}}?")
    .stash("res")
    .print("Hi {{res}}!");
});

task("interpolate-default", "test interpolate default value", function () {
  shell()
    .set("wat")
    .print("wait {{}}");
});

task("interpolate-multiple", "test interpolate multiple values", function () {
  shell()
    .set("bang")
    .set("bang", "boom")
    .print("{{}} - {{bang}} - {{}}");
});

task("eachLine", "test eachLine", function() {
  shell()
    .exec("ls -al")
    .eachLine(function(line, i) {
      print("${i}: ${line}");
    })
    .print("DONE");
});

task("stash", "test stash/pipe", function() {
  shell()
    .exec("ls -al")
    .stash("mykey")
    .exec("ls")
    .pipe("cat", "mykey")
    .print();
});

task("unstash", "test stash/unstash", function() {
  shell()
    .exec("ls -al")
    .stash("mykey")
    .exec("ls")
    .unstash("mykey")
    .pipe("cat")
    .print();
});

task("result", "test return of result", function () {
  var result =
    shell()
      .exec("ls -al")
      .get();

  print(result);
});

task("result-stashed", "test return of stashed result", function () {
  var result =
    shell()
      .exec("ls -al")
      .stash("mylist")
      .exec("ls")
      .get("mylist");
  print(result);
});

task("apply", "test apply", function () {
  shell()
    .exec("ls -al")
    .apply(function (val) {
      return val.toUpperCase();
    })
    .print();
});

task("apply-stashed", "test apply stashed", function () {
  shell()
    .exec("ls")
    .stash("mylist")
    .exec("ls -al")
    .apply(function (val) {
      return java.lang.String.join(" ", val.split("\n"));
    }, "mylist")
    .unstash("mylist")
    .print();
});

task("set", "test set", function () {
  shell()
    .exec("ls -al")
    .set("abc")
    .print();
});

task("set-key", "test set with key", function () {
  shell()
    .set("mykey", "BAM")
    .exec("ls -al")
    .unstash("mykey")
    .print();
});

task("print-err", "test print stderr", function () {
  shell()
    .printErrors()
    .exec("java -version");
});
