task("watch", "test file watcher", function () {
  watch()
    .on('change', function (ev) {
      print("change detected: ${ev}");
    })
    .start();
});
