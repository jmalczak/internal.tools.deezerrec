DeezerRec 
=========

Description
---------
Tool to record deezer albums to mp3 using NAudio library and Deezer JavaScript API. It records everything what goes to the output
of your sound card, so if you play anything else during recording, your output files will contain additional audio.

Requirements
---------

*   Microsoft .NET Framework 4.5
*   Internet Explorer 11
*   Administrator privileges
*   You have to have valid premium account to record full songs (API with full songs is availabel only for premium accounts)

Setup
----------
[Setup](/Setup/setup.exe) file is included in Setup folder. Application will be installed using Install Shield in program files directory.


Configuration
----------
You can use configuration file which is located in your install folder. File is named the same as main executable with .config suffux.

### DOWNLOAD_FOLDER 
Folder where dowloaded files will be stored

### ROOT_URL
Url on which internall http server will listen. Application use Deezer JavaScript API and it hosts HTML page with JavaScript files
within WPF application. To do that it starts internal HTTP server on particular port. If port is in use application won't be working
correctly. You should then change root url port to port which is free on your computer.

Application Screen Shots
-----------
![Deezer Recorder](/Setup/DeezerRecorder.png)

Copyright
-----------
Music from Deezer.com is copyrighted. Any redistribution of it without the consent of the copyright owners may be a violation of the law in most countries, including the USA. DeezerRec is pure proof of concept application and I don't recommend to use it to download illegal music.