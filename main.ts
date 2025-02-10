function init_sw () {
    pins.setPull(DigitalPin.P0, PinPullMode.PullNone)
    pins.setPull(DigitalPin.P5, PinPullMode.PullUp)
    pins.setPull(DigitalPin.P8, PinPullMode.PullUp)
    pins.setPull(DigitalPin.P11, PinPullMode.PullUp)
    pins.setPull(DigitalPin.P12, PinPullMode.PullUp)
    pins.setPull(DigitalPin.P13, PinPullMode.PullUp)
    pins.setPull(DigitalPin.P14, PinPullMode.PullUp)
    pins.setPull(DigitalPin.P15, PinPullMode.PullUp)
    pins.setPull(DigitalPin.P16, PinPullMode.PullUp)
}
function set_dir (bank: number, dir2: number) {
    pins.i2cWriteNumber(
    mcp_devadr,
    bank,
    NumberFormat.UInt8LE,
    true
    )
    pins.i2cWriteNumber(
    mcp_devadr,
    dir2,
    NumberFormat.UInt8LE,
    false
    )
}
function write_dlg (bank: number, data: number) {
    wbank = bank + 18
    pins.i2cWriteNumber(
    mcp_devadr,
    wbank,
    NumberFormat.UInt8LE,
    true
    )
    pins.i2cWriteNumber(
    mcp_devadr,
    data,
    NumberFormat.UInt8LE,
    false
    )
}
function flowLED () {
    for (let カウンター = 0; カウンター <= 7; カウンター++) {
        write_dlg(1, 2 ** カウンター)
        basic.pause(100)
    }
}
function init_all () {
    serial.redirectToUSB()
    radio.setGroup(90)
    init_sw()
    init_mcp()
}
function init_mcp () {
    mcp_devadr = 32
    set_dir(0, 255)
    set_dir(1, 0)
    set_pull(0, 255)
}
function send_joy () {
    radio.sendString("")
}
function read_dig (bank2: number) {
    rbank = bank2 + 18
    pins.i2cWriteNumber(
    mcp_devadr,
    rbank,
    NumberFormat.UInt8LE,
    true
    )
    return pins.i2cReadNumber(mcp_devadr, NumberFormat.UInt8LE, false)
}
function set_pull (bank3: number, data: number) {
    pbank = bank3 + 12
    pins.i2cWriteNumber(
    mcp_devadr,
    pbank,
    NumberFormat.UInt8LE,
    true
    )
    pins.i2cWriteNumber(
    mcp_devadr,
    data,
    NumberFormat.UInt8LE,
    false
    )
}
let pbank = 0
let rbank = 0
let wbank = 0
let mcp_devadr = 0
let value = 250
let alternate = 0
init_all()
basic.forever(function () {
	
})
basic.forever(function () {
    if (alternate == 0) {
        basic.showIcon(IconNames.Happy)
        alternate += 1
    } else {
        basic.showLeds(`
            . . . . .
            . . # . #
            . . . . .
            # . . . #
            . # # # .
            `)
        alternate += -1
    }
    basic.pause(500)
})
basic.forever(function () {
    if (pins.digitalReadPin(DigitalPin.P13) < 0.5) {
        radio.sendNumber(1)
        basic.showIcon(IconNames.EighthNote)
        basic.pause(500)
    }
    basic.pause(100)
})
basic.forever(function () {
    flowLED()
})
