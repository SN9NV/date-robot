# Date Robot
A tray applet that gives you the ability to type out the date in the active window by just clicking on the applet's icon in the tray.

### Pre-requisites for building
 * NodeJS
 * Node-gyp (npm install -g node-gyp)
 * Electron (npm install -g electron)
 * Electron-rebuild (npm install -g electron-rebuild)

Get all dependencies: sudo npm install -g node-gyp electron electron-rebuild
(Windows won't need the `sudo` part of the above command)
 
### Build
npm install && npm run build:first

For non-OSX operating systems, you have a choice of 2 themes, normal and dark.
Normal is applied normally, but dark is applied by giving the argument `dark` on launch.
OSX has a theme engine that uses the template icon to keep the theme consistent (I believe).

### Screenshots
Ubuntu

![Ubuntu Screenshot](https://github.com/SN9NV/date-robot/blob/master/Ubuntu-screenshot.png "Ubuntu Screenshot")