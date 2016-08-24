import Cylon = require("cylon")

Cylon.config({
  //silent: true
});


export default {
  openConnection: function(){
    return new Promise((res, rej)=>{
      var devices = {}
      for(var i = 0; i <= 13; i++){
        devices[i] = { driver: 'direct-pin', pin: i }
      }
      // Initialize the robot
      Cylon.robot({
        // Change the port to the correct port for your Arduino.
        connections: {
          //list ports http://stackoverflow.com/questions/14550880/serialport-has-no-method-list
          arduino: { adaptor: 'firmata', port: 'COM3' }
        },

        devices: devices,

        work: function(my) {
            var pins = (p) => my[p]
            res(pins)

        }
      }).start();
    })
  }
}
