module.exports = {
    pins: {
        paperLevelSensor: 7, // Connect both TRIG and ECHO to this pin (see https://github.com/rwaldron/johnny-five/blob/master/docs/hc-sr04.md)
        infraredEmitter: 3,
        infraredDetector: "A0",
        servoDispense: 9,
        servoCutLeft: 10,
        servoCutRight: 11
    },
    paperLowDistanceCm: 5,
    handSensorThreshold: 8
};