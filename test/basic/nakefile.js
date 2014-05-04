task("test1", "prints a message", function() {
  print("Hello, World!");
});

task("test2", "prints 'pwd' directory", function() {
  $EXEC("pwd");
  print("pwd is: ${$OUT}");
});

task("test3", "prints the path set by nake", function() {
  print("current path is: ${path}");
});

task("test4", "throws an error", function() {
  throw 'task failure';
});

task("test5", "print java version", function() {
  `java -version`
  print($ERR);
});

task("test6", "print options", function(options) {
  print(Object.prototype.toString.call(options));
  print("options: ${options}");
});

task("test7", "add args: a + b", function(options) {
  var a = parseInt(options[0]);
  var b = parseInt(options[1]);
  print("${a} + ${b} = ${a + b}");
});

task("test8", "exec cmd in other directory", function() {
  $ENV["PWD"] = "/usr/local/bin";
  print(`ls -l`);
});

task("test9", "cat content of this script", function() {
  $EXEC("cat ${__FILE__}");
  print($OUT);
});

task("test10", "show file size of this script", function() {
  var File = Java.type("java.io.File");
  var scriptFile = new File(__FILE__);
  print("size of script file: ${scriptFile.length()} bytes");
});
