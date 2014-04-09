Nake
===========

Nake is a simplified version of [Make](https://www.gnu.org/software/make/) ([Cake](http://coffeescript.org/documentation/docs/cake.html), [Jake](https://github.com/280north/jake), [Rake](http://rake.rubyforge.org/)) for Java 8 which runs on the Nashorn Javascript Engine.

You define tasks in a project specific `Nakefile` and call them from the command line. Tasks are written in Javascript executed on the Nashorn Javascript Engine, so the script runs natively on the JVM. This enables you to utilize everything from the JDK 8 API or any external Java libraries.

Running `nake` with no arguments prints all tasks in the current directory's Nakefile.

Use `nake -- taskName [options]` to run a specific task from your Nakefile.

Read my [Nashorn Tutorial](http://winterbe.com/posts/2014/04/05/java8-nashorn-tutorial/) to get started with Nashorn.
