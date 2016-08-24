import electron = require("electron");
//FUCK ELECTRON/SERIALPORT follow below to get working
//then copy that folder to replace the cylon/fermada/serialport folder
//http://meow.noopkat.com/using-node-serialport-in-an-electron-app/
import pinMan from "./libs/pinMan";

import cp = require('child_process')

var makePromise:any = function(){
  var args = Array.prototype.slice.call(arguments)
  var caller = args[0]
  var func = args[1]
  var callArgs = args.filter((el, index) => index > 1) //filter out caller and function
  return new Promise((res, rej) =>{
    callArgs.push(function(){
      res(Array.prototype.slice.call(arguments))
    })
    func.apply(caller, callArgs)
  })
}

var main = async ()=>{
  //wait for cylon to connect to device

  //wait for electron to init
  await makePromise(electron.app, electron.app.on, 'ready')

  var con:any = await pinMan.openConnection()
  var lightState = 0

  var rezState = 0

  var tray = new electron.Tray(`${__dirname}/favicon.png`)
  var contextMenu = electron.Menu.buildFromTemplate([
      {
        label: 'ToggleLamp',
        type: 'normal',
        click: () => {
          lightState = lightState == 0 ? 1 : 0
          con(8).digitalWrite(lightState)
        }
      },
      {
        label: 'ChangeRez',
        type: 'normal',
        click: () => {
          rezState = rezState == 0 ? 1 : 0
          if(rezState){
            cp.exec('nircmd setdisplay 3840 2160 32');
          }else{
            cp.exec('nircmd setdisplay 1920 1080 32');
          }
        }
      },
      {
        label: 'OpenTwitchVLC',
        type: 'normal',
        click: () => {
          cp.exec('"D:\\Programs\\Livestreamer\\livestreamer.exe" '+electron.clipboard.readText()+' best --player "D:\\Programs\\VLC\\vlc.exe"')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        type: 'normal',
        click: () => {
          electron.app.quit()
        }
      }
    ])
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
    console.log("ready")
}
try{
  main();
}catch(e){
  console.log(e.stack)
}
