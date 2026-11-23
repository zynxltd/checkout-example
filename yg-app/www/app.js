(function () {
  var C = window.Capacitor;
  if (!C || typeof C.isNativePlatform !== 'function' || !C.isNativePlatform()) return;

  var plugins = C.Plugins || {};

  if (plugins.StatusBar) {
    plugins.StatusBar.setStyle({ style: 'DARK' });
    plugins.StatusBar.setBackgroundColor({ color: '#264f1c' });
  }
  if (plugins.SplashScreen) plugins.SplashScreen.hide();

  if (plugins.Network) {
    plugins.Network.getStatus().then(function (s) {
      if (!s.connected) window.location.replace('./offline.html');
    });
    plugins.Network.addListener('networkStatusChange', function (s) {
      if (!s.connected) window.location.replace('./offline.html');
    });
  }

  if (plugins.App) {
    plugins.App.addListener('backButton', function (ev) {
      if (ev.canGoBack) window.history.back();
      else plugins.App.exitApp();
    });
  }
})();
