Nake
===========

Nake is a simplified version of [Make](https://www.gnu.org/software/make/) ([Cake](http://coffeescript.org/documentation/docs/cake.html), [Jake](https://github.com/280north/jake), [Rake](http://rake.rubyforge.org/)) for Java 8 which runs on the Nashorn Javascript Engine.

You define tasks in a project specific `Nakefile` and call them from the command line. Tasks are written in Javascript executed on the Nashorn Javascript Engine, so the script runs natively on the JVM. This enables you to utilize everything from the JDK 8 API or any external Java libraries.

Usage
===========

Running `nake` with no arguments prints all tasks in the current directory's Nakefile.

Use `nake -- taskName [options]` to run a specific task from your Nakefile.

Installation
===========

Nake currently runs on POSIX systems  only (Mac OSX, Linux). Please contact me if you're interested in using Nake from Windows.

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

Create a file `Nakefile` in any directory with the following content:

```javascript
task('hello', 'Hello World', function() {
  print('Hello World!');
}
```

Open the terminal, cd into the directory and type `nake -- hello`.

Read my [Nashorn Tutorial](http://winterbe.com/posts/2014/04/05/java8-nashorn-tutorial/) to get started with Nashorn.

Contribute
===========

Your Feedback is highly appreciated. Feel free to ping me on [Twitter](https://twitter.com/benontherun), file an issue or send me a Pull Request.
