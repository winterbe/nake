Nake
===========

Nake is a simplified version of [Make](https://www.gnu.org/software/make/) ([Cake](http://coffeescript.org/documentation/docs/cake.html), [Jake](https://github.com/280north/jake), [Rake](http://rake.rubyforge.org/)) for the Java 8 [Nashorn](http://docs.oracle.com/javase/8/docs/technotes/guides/scripting/nashorn/toc.html) Javascript Engine.

You define tasks in a project specific `Nakefile` and call them from the command line. Tasks are written in Javascript and run natively on the JVM by utilizing Nashorns `jjs -scripting` command. This enables you to utilize everything from the JDK 8 API or any external Java libraries.

Usage
===========

Running `nake` with no arguments prints all tasks in the current directory's Nakefile.

Use `nake -- taskName [options]` to run a specific task from your Nakefile.

Installation
===========

Nake currently runs on POSIX systems  only (Mac OSX, Linux). _Please contact me if you're interested in using Nake from Windows._

 - Install [Java 8](http://www.oracle.com/technetwork/java/javase/overview/index.html) and make sure `$JAVA_HOME` points to your Java home directory
 - Link `jjs` to `/usr/bin` so you can use it from any directory:
```bash
$ cd /usr/bin
$ ln -s $JAVA_HOME/bin/jjs jjs
```
 - Clone the nake repository or copy `src/nake.js` to your machine
 - Make `nake.js` executable: `chmod +x /path/to/nake/src/nake.js`
 - Link `src/nake.js` to `usr/bin` so you can use it from any directory:
```bash
$ cd /usr/bin
$ ln -s /path/to/nake/src/nake.js nake
```

Getting started
===========

Create a file called `Nakefile` in your projects root directory with the following content:

```javascript
task('hello', 'Hello World', function() {
  print('Hello World!');
};
```

Open the terminal, cd into any project directory and type `nake -- hello`.

Next, check out these [example tasks](https://github.com/winterbe/nake/blob/master/test/basic/Nakefile). You should also consider reading my [Nashorn Tutorial](http://winterbe.com/posts/2014/04/05/java8-nashorn-tutorial/) to get started with the Nashorn engine.

Java Example
===========

The [java example](https://github.com/winterbe/nake/blob/master/test/java) found in `test/java` contains a sample java application with some basic java-related [nake tasks](https://github.com/winterbe/nake/blob/master/test/java/Nakefile):

#### Run the java application:

```bash
nake -- run
```

#### Compile all java files:

```bash
nake -- compile
```

#### Watch for changes and automatically recompile java files:

```bash
nake -- watch
```

Keep in mind that you can run nake tasks from any subfolder of your project.

Contribute
===========

Your Feedback is highly appreciated. Feel free to file and issue or ping me on [Twitter](https://twitter.com/benontherun) or [Google+](https://plus.google.com/105973259367211176218/posts).
