module.exports = {
    pins: {
        paperLevelSensor: 7, // Connect both TRIG and ECHO to this pin (see https://github.com/rwaldron/johnny-five/blob/master/docs/ping.md)
        infraredEmitter: 3,
        infraredDetector: "A0",
        servoDispense: 9,
        servoCutLeft: 10,
        servoCutRight: 11
    },
    paperLowDistanceCm: 8,
    handSensorThreshold: 8
};