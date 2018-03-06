"use strict";

const HID = require('node-hid');
const storage = require('node-persist');

//Error
//throw Error('[PARSE-ERROR] ' + file + ' does not look like a valid storage file!');
//> rm -Rf .node-persist/storage/

function setRumbleLed(hidDevice, rumbleL, rumbleR, led_cmd ) {
    hidDevice.write([
        0x01,     // <- feature report id
        0x00, 0xfe, rumbleL, 0xfe, rumbleR,
        0x00, 0x00, 0x00, 0x00, led_cmd,
        0xff, 0x27, 0x10, 0x00, 0x32,
        0xff, 0x27, 0x10, 0x00, 0x32,
        0xff, 0x27, 0x10, 0x00, 0x32,
        0xff, 0x27, 0x10, 0x00, 0x32,
        0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ]);
};

function gotData(err, data) {
    var previousValue1 = storage.getItemSync('data15');   //console.log('got ps3 data', data[6] + ":" + data[7] + ":" + data[8] +":" +  data[9]);   // map left & right d-pad to rumble, and right action buttons to LEDs
    var previousValue2 = storage.getItemSync('data17');
    setRumbleLed( this, data[15], data[17], data[3]>>3 );
    storage.setItemSync('data15',data[15]);
    storage.setItemSync('data17',data[17]);
    var currentValue1 = storage.getItemSync('data15');
    var currentValue2 = storage.getItemSync('data17');
    if (previousValue1 != currentValue1 || previousValue2 !=currentValue2) {
      this.socket.emit ('ps3Controller', "data15:" + currentValue1 + ":" + "data17:" + currentValue2);
      console.log("gotData:ps3Controller:" + this.socket);
    }
    this.read(gotData.bind(this));
};

module.exports = class DualShock {
    constructor(io) {
        this.namespace = io.of('/');
        this.hid = new HID.HID(1356, 616);
        storage.initSync();
        this.initial();
        this.listen();
    };
    initial() {
        try {
            console.log('features', this.hid.getFeatureReport(0xf2, 17)); // note: this fails for bluetooth connections, so we catch
        } catch(err) {
            console.log("Error" + err);
        }
    };
    listen() {
        this.namespace.on('connection', socket => { // Web Socket Connection
            this.hid.socket = socket;
            this.hid.read(gotData.bind(this.hid)); //initial start off

            //socket.on('ps3Controller', data => {
            //     var data15 = storage.getItemSync('data15');
            //     var data17 = storage.getItemSync('data17');
            //     socket.emit ('ps3Controller', "data15:" + data15 + ":" + "data17:" + data17);
            //});
        });
    };
    // setRumbleLed(hidDevice, rumbleL, rumbleR, led_cmd ) {
    //     hidDevice.write([
    //         0x01,     // <- feature report id
    //         0x00, 0xfe, rumbleL, 0xfe, rumbleR,
    //         0x00, 0x00, 0x00, 0x00, led_cmd,
    //         0xff, 0x27, 0x10, 0x00, 0x32,
    //         0xff, 0x27, 0x10, 0x00, 0x32,
    //         0xff, 0x27, 0x10, 0x00, 0x32,
    //         0xff, 0x27, 0x10, 0x00, 0x32,
    //         0x00, 0x00, 0x00, 0x00, 0x00,
    //         0x00, 0x00, 0x00, 0x00, 0x00,
    //         0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    //     ]);
    // };
    // gotData(err, data) {
    //     console.log('got ps3 data', data[6] + ":" + data[7] + ":" + data[8] +":" +  data[9]);   // map left & right d-pad to rumble, and right action buttons to LEDs
    //     setRumbleLed( this.hid, data[15], data[17], data[3]>>3 );
    //     storage.setItemSync('data15',data[15]);
    //     storage.setItemSync('data17',data[17]);
    //     this.read(this.gotData.bind(this));
    // };
}

// module.exports = class DualShock {
//     constructor(dualShock) {
//         console.log('ryan007 start')
//         this.controller = dualShock(
//             {
//                 //you can use a ds4 by uncommenting this line.
//                 //config: "dualshock4-generic-driver",
//                 //if using ds4 comment this line.
//                 config : "dualShock3",
//                 //smooths the output from the acelerometers (moving averages) defaults to true
//                 accelerometerSmoothing : true,
//                 //smooths the output from the analog sticks (moving averages) defaults to false
//                 analogStickSmoothing : false
//             });
//         this.initial();
//         this.eventlistener();
//     };
//
//     initial() {
//         controller.on('error', err => console.log(err));
//
//         controller.setExtras({
//             rumbleLeft:  0,   // 0-255 (Rumble left intensity)
//             rumbleRight: 0,   // 0-255 (Rumble right intensity)
//             red:         0,   // 0-255 (Red intensity)
//             green:       75,  // 0-255 (Blue intensity)
//             blue:        225, // 0-255 (Green intensity)
//             flashOn:     40,  // 0-255 (Flash on time)
//             flashOff:    10   // 0-255 (Flash off time)
//         });
//
//         controller.setExtras({
//             rumbleLeft:  0,   // 0-1 (Rumble left on/off)
//             rumbleRight: 0,   // 0-255 (Rumble right intensity)
//             led: 2 // 2 | 4 | 8 | 16 (Leds 1-4 on/off, bitmasked)
//         });
//
//
//     };
//
//     eventlistener() {
//         controller.on('left:move', data => console.log('left Moved: ' + data.x + ' | ' + data.y));
//
//         controller.on('right:move', data => console.log('right Moved: ' + data.x + ' | ' + data.y));
//
//         controller.on('connected', () => console.log('connected'));
//
//         controller.on('square:press', ()=> console.log('square press'));
//
//         controller.on('square:release', () => console.log('square release'));
//
//         //DualShock 4 TouchPad
//         //finger 1 is x1 finger 2 is x2
//         controller.on('touchpad:x1:active', () => console.log('touchpad one finger active'));
//
//         controller.on('touchpad:x2:active', () => console.log('touchpad two fingers active'));
//
//         controller.on('touchpad:x2:inactive', () => console.log('touchpad back to single finger'));
//
//         controller.on('touchpad:x1', data => console.log('touchpad x1:', data.x, data.y));
//
//         controller.on('touchpad:x2', data => console.log('touchpad x2:', data.x, data.y));
//
//
//         //right-left movement
//         controller.on('rightLeft:motion', data => console.log(data));
//
//         //forward-back movement
//         controller.on('forwardBackward:motion', data => console.log(data));
//
//         //up-down movement
//         controller.on('upDown:motion', data => console.log(data));
//
//         //controller status
//         //as of version 0.6.2 you can get the battery %, if the controller is connected and if the controller is charging
//         controller.on('battery:change', data => console.log(data));
//
//         controller.on('connection:change', data => console.log(data));
//
//         controller.on('charging:change', data => console.log(data));
//     };
//
// }
