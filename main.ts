//% color=#F0a020 icon="\uf001" block="BOB V2 gamepad" weight=100

namespace bob2_gamepad {
    function init_sw() {
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
    function init_mcp() {
        mcp_devadr = 32
        set_dir(0, 255)
        set_dir(1, 0)
        set_pull(0, 255)
    }
    //% block="はじめにやる"
    export function init_all() {
        serial.redirectToUSB()
        init_sw()
        init_mcp()
    }
    function set_dir(bank: number, dir2: number) {
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
    function write_dlg(bank: number, data: number) {
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
    function read_dig(bank2: number) {
        rbank = bank2 + 18
        pins.i2cWriteNumber(
            mcp_devadr,
            rbank,
            NumberFormat.UInt8LE,
            true
        )
        return pins.i2cReadNumber(mcp_devadr, NumberFormat.UInt8LE, false)
    }
    function set_pull(bank3: number, data: number) {
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

    //% block="ながれるLED"
    export function flowLED() {
        for (let カウンター = 0; カウンター <= 7; カウンター++) {
            write_dlg(1, 2 ** カウンター)
            basic.pause(100)
        }
    }
    //% block="LED %pos をつける"
    export function LED_on(pos: number) {
        // posは0〜7
        let registerValue = read_dig(1);  // 現在のレジスタ値を取得
        let newValue = registerValue | (1 << pos);  // 指定したビットを1にする
        write_dig(1, newValue);
    }

    //% block="LED %pos をけす"
    export function LED_off(pos: number) {
        // posは0〜7
        let registerValue = read_dig(1);  // 現在のレジスタ値を取得
        let newValue = registerValue & ~(1 << pos);  // 指定したビットを0にする
        write_dig(1, newValue);
    }
    //% block="a ボタン"
    export function sw_a() {
        if (pins.digitalReadPin(DigitalPin.P13) < 0.5) {
            return true
        } else {
            return false
        }
    }
    //% block="b ボタン"
    export function sw_b() {
        if (pins.digitalReadPin(DigitalPin.P14) < 0.5) {
            return true
        } else {
            return false
        }
    }
    //% block="x ボタン"
    export function sw_x() {
        if (pins.digitalReadPin(DigitalPin.P15) < 0.5) {
            return true
        } else {
            return false
        }
    }
    //% block="y ボタン"
    export function sw_y() {
        if (pins.digitalReadPin(DigitalPin.P16) < 0.5) {
            return true
        } else {
            return false
        }
    }
    //% block="l ボタン"
    export function sw_l() {
        if (pins.digitalReadPin(DigitalPin.P8) < 0.5) {
            return true
        } else {
            return false
        }
    }
    //% block="r ボタン"
    export function sw_r() {
        if (pins.digitalReadPin(DigitalPin.P12) < 0.5) {
            return true
        } else {
            return false
        }
    }
    //% block="スタート"
    export function sw_start() {
        if (pins.digitalReadPin(DigitalPin.P11) < 0.5) {
            return true
        } else {
            return false
        }
    }
    //% block="セレクト"
    export function sw_select() {
        if (pins.digitalReadPin(DigitalPin.P5) < 0.5) {
            return true
        } else {
            return false
        }
    }
    //% block="ジョイスティックボタン"
    export function sw_joy() {
        if (pins.digitalReadPin(DigitalPin.P0) < 0.5) {
            return true
        } else {
            return false
        }
    }
    //% block="ジョイスティック X"
    export function joy_x()
    {
        return( pins.analogReadPin(AnalogReadWritePin.P1) )
    }
    //% block="ジョイスティック Y"
    export function joy_y()
    {
        return( pins.analogReadPin(AnalogReadWritePin.P2) )
    }

    let pbank = 0
    let rbank = 0
    let wbank = 0
    let mcp_devadr = 0
    init_all()
    basic.forever(function () {
        if (pins.digitalReadPin(DigitalPin.P13) == 0) {
            basic.showIcon(IconNames.Giraffe)
        } else {
            basic.showIcon(IconNames.Diamond)
        }
        serial.writeLine("joy")
        serial.writeValue("p1", pins.analogReadPin(AnalogReadWritePin.P1))
        serial.writeValue("p2", pins.analogReadPin(AnalogReadWritePin.P2))
        serial.writeLine("sw")
        serial.writeValue("p0", pins.digitalReadPin(DigitalPin.P0))
        serial.writeValue("p5", pins.digitalReadPin(DigitalPin.P5))
        serial.writeValue("p8", pins.digitalReadPin(DigitalPin.P8))
        serial.writeValue("p11", pins.digitalReadPin(DigitalPin.P11))
        serial.writeValue("p12", pins.digitalReadPin(DigitalPin.P12))
        serial.writeValue("p13", pins.digitalReadPin(DigitalPin.P13))
        serial.writeValue("p14", pins.digitalReadPin(DigitalPin.P14))
        serial.writeValue("p15", pins.digitalReadPin(DigitalPin.P15))
        serial.writeValue("p16", pins.digitalReadPin(DigitalPin.P16))
        serial.writeLine("ioexp")
        serial.writeValue("b0", read_dig(0))
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
}