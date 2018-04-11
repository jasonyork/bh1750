const raspi = require('raspi');
const I2C = require('raspi-i2c').I2C;
var _ = require('lodash');
var utils = require('./utils');

var BH1750 = function (opts) {
    this.options = _.extend({}, {
        address: 0x23,
        device: '/dev/i2c-1',
        command: 0x10,
        length: 2
    }, opts);
    raspi.init(() => {
      const i2c = new I2C();
      console.log(i2c.readByteSync(0x18)); // Read one byte from the device at address 18
    });
};

BH1750.prototype.readLight = function (cb) {
    var self = this;
    if (!utils.exists(cb)) {
        throw new Error("Invalid param");
    }
    raspi.init(() => {
      const i2c = new I2C();
      i2c.read(this.options.address, self.options.command, self.options.length, function (err, res) {
        if (utils.exists(err)) {
            console.error("error: I/O failure on BH1750 - command: ", self.options.command);
            return;
        }
        var hi = res.readUInt8(0);
        var lo = res.readUInt8(1);
        var lux = ((hi << 8) + lo)/1.2;
        if (self.options.command = 0x11) {
            lux = lux/2;
        }
        cb.call(self, lux);
      });
    });
};

module.exports = BH1750;
