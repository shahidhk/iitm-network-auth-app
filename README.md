# IIT Madras Network Auth 

[![Build Status](https://travis-ci.org/shahidhk/iitm-network-auth-app.svg?branch=master)](https://travis-ci.org/shahidhk/iitm-network-auth-app) [![Build status](https://ci.appveyor.com/api/projects/status/rf1ruqokr1hai9ds?svg=true&retina=true)](https://ci.appveyor.com/project/shahidhk/iitm-network-auth-app) [![Analytics](https://ga-beacon.appspot.com/UA-49243395-6/home-page)](https://github.com/igrigorik/ga-beacon)

Cross platform desktop application for authenticating Windows/Linux/Mac devices with IIT Madras campus network firewall. Built with [electron](http://electron.atom.io).

**Note: app works only inside IIT Madras campus network.**  
**Please file bugs and feature requests at [issues](https://github.com/shahidhk/iitm-network-auth-app/issues).**


## Download
[![ubuntu](https://github.com/shahidhk/iitm-network-auth-app/raw/master/build/ubuntu.png)](https://server.waviness63.hasura-app.io/download/version/latest/linux)
[![debian](https://github.com/shahidhk/iitm-network-auth-app/raw/master/build/debian.png)](https://server.waviness63.hasura-app.io/download/version/latest/linux)
[![appimage](https://github.com/shahidhk/iitm-network-auth-app/raw/master/build/linux.png)](https://server.waviness63.hasura-app.io/download/version/latest/appimage)
[![windows](https://github.com/shahidhk/iitm-network-auth-app/raw/master/build/windows.png)](https://server.waviness63.hasura-app.io/download/version/latest/windows)
[![macos](https://github.com/shahidhk/iitm-network-auth-app/raw/master/build/mac.png)](https://server.waviness63.hasura-app.io/download/version/latest/mac)  

## Screenshot 
![image](https://github.com/shahidhk/iitm-network-auth-app/raw/master/preview.png)

## Installation

Download the latest release for your platform from [GitHub Releases page](https://github.com/shahidhk/iitm-network-auth-app/releases).

**Note: Windows and Mac systems might show some security warnings. Please override/ignore these restrictions and install the app, as these warnings occur due to not signing the executable, which requires buying a code-signing certificate.**

## Usage

- Type in the username, password and click login.
- Check save option to keep username and password in the system.
- This will create a new session with IIT Madras network firewall.
- The connectivity indicator below the IITM logo shows current status, whether connected or not.
- Keep the application open to maintain the login session.
- Use the logout button to terminate the session.
- Note: each login session is valid for 10 minutes. The application refresh the session every 9 minutes. Hence, even if you close the application, the session maybe valid for at-most 10 minutes, unless you logout.
- The app will automatically download and install updates on Windows and Mac.
- New updates will be shown at the bottom, click that to download.

## Privacy and Security

- This application does not collect any personal information regarding the user. 
- The username and password used for authentication are stored locally, in order to automatically connect at startup.
- The application may collect anonymous data for statistical purposes.
- The application will occasionally contact the update server for checking and downloading updates.

## Contributing

Pull requests and issues are most welcome.

The app is made using [electron](http://electron.atom.io), and built with [electron-builder](https://github.com/electron-userland/electron-builder) using [Travis CI](https://travis-ci.org) for Linux/Mac builds and [Appveyor CI](http://www.appveyor.com) for Windows builds. 

## Todo
- Re-authentication on waking up from sleep.
- Implement `netaccess` authentication.

## Credits
- [electron](http://electron.atom.io)
- [electron-builder](https://github.com/electron-userland/electron-builder)
- [nuts](https://github.com/GitbookIO/nuts)
- [hasura](https://hasura.io)
- [ea-todo](https://github.com/Vj3k0/ea-todo) by [Vjekoslav Ratkajec](https://github.com/Vj3k0)
- [Travis CI](https://travis-ci.org) 
- [Appveyor CI](http://www.appveyor.com)
- [iitm-network-auth](https://shahidhk.github.io/iitm-network-auth)

## License 

[MIT](https://github.com/shahidhk/iitm-network-auth-app/blob/master/LICENSE)
