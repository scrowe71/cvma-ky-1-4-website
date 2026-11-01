// Loads the editable site content (site/content/*.json, edited in Pages CMS),
// then starts the site scripts. If a file can't be loaded, that section shows empty
// rather than breaking the whole page.
(function () {
  var files = ['home', 'about', 'officers', 'events', 'albums', 'contact'];
  var stamp = Date.now(); // always fetch the latest content after an edit
  function load(name) {
    return fetch('content/' + name + '.json?v=' + stamp, { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(name + ': ' + r.status); return r.json(); })
      .catch(function (e) { console.error('Content file failed to load:', e); return null; });
  }
  function start(src) {
    return new Promise(function (resolve) {
      var s = document.createElement('script');
      s.src = src + '?v=' + stamp;
      s.onload = resolve;
      document.body.appendChild(s);
    });
  }
  Promise.all(files.map(load)).then(function (data) {
    var content = {};
    files.forEach(function (name, i) { if (data[i] != null) content[name] = data[i]; });
    window.CONTENT = content;
    return start('calendar.js').then(function () { return start('app.js'); });
  });
})();
