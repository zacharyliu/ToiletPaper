module.exports = {
    pins: {
        display: {
            A: 3,
            B: 4,
            C: 5
        },
        servoCoins: 6,
        paperLevelSensor: 7, // Connect both TRIG and ECHO to this pin (see https://github.com/rwaldron/johnny-five/blob/master/docs/ping.md)
        doorSensor: 8,
        servoDispense: 9,
        servoCutLeft: 10,
        servoCutRight: 11,
        infraredEmitter: 12,
        infraredDetector: "A0"
    },
    cameras: {
        coin: 2
    },
    zerorpc: {
        CameraCoins: 'tcp://127.0.0.1:4242',
        CameraLines: 'tcp://127.0.0.1:4243'
    },
    paperLowDistanceCm: 8,
    handSensorThreshold: 25,
    pricePerSheet: 10,
    dogeCloud: 'http://107.170.74.162:3000'
};