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
        pins.i2cWriteNumber(
            mcp_devadr,
            bank + 18,
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
        pins.i2cWriteNumber(
            mcp_devadr,
            bank2 + 18,
            NumberFormat.UInt8LE,
            true
        )
        return pins.i2cReadNumber(mcp_devadr, NumberFormat.UInt8LE, false)
    }
    function set_pull(bank3: number, data: number) {
        pins.i2cWriteNumber(
            mcp_devadr,
            bank3 + 12,
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

    let mcp_devadr = 0
    init_all()
}