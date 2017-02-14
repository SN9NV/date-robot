# Date Robot
A tray applet that gives you the ability to type out the date in the active window by just clicking on the applet's icon in the tray.

### Pre-requisites for building
 * NodeJS (https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
 * libxtst-dev and libpng++-dev (`sudo apt install libxtst-dev libpng++-dev`) for RobotJS (https://github.com/octalmage/robotjs)
 
### Build
npm install && npm run build:first

For non-OSX operating systems, you have a choice of 2 themes, normal and dark.
Normal is applied normally, but dark is applied by giving the argument `dark` on launch.
OSX has a theme engine that uses the template icon to keep the theme consistent (I believe, this has not been tested).

### Screenshots
Ubuntu

![Ubuntu Screenshot](https://github.com/SN9NV/date-robot/blob/master/Ubuntu-screenshot.png "Ubuntu Screenshot")
