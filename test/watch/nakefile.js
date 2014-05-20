task("watch", "test file watcher", function () {
  watch()
    .on('change', function (ev) {
      print("change: path=${ev.path}; type=${ev.type}");
    })
    .start();
});

task("watchTypes", "test different event types", function () {
  watch()
    .on('create', function (ev) {
      print("create: ${ev.path}");
    })
    .on('delete', function (ev) {
      print("delete: ${ev.path}");
    })
    .on('modify', function (ev) {
      print("modify: ${ev.path}");
    })
    .start();
});
