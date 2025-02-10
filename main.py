def init_sw():
    pins.set_pull(DigitalPin.P0, PinPullMode.PULL_NONE)
    pins.set_pull(DigitalPin.P5, PinPullMode.PULL_UP)
    pins.set_pull(DigitalPin.P8, PinPullMode.PULL_UP)
    pins.set_pull(DigitalPin.P12, PinPullMode.PULL_UP)
    pins.set_pull(DigitalPin.P13, PinPullMode.PULL_UP)
    pins.set_pull(DigitalPin.P14, PinPullMode.PULL_UP)
    pins.set_pull(DigitalPin.P15, PinPullMode.PULL_UP)
    pins.set_pull(DigitalPin.P16, PinPullMode.PULL_UP)
def set_dir(bank: number, dir2: number):
    pins.i2c_write_number(mcp_devadr, bank, NumberFormat.UINT8_LE, True)
    pins.i2c_write_number(mcp_devadr, dir2, NumberFormat.UINT8_LE, False)
def init_all():
    serial.redirect_to_usb()
    radio.set_group(127)
    init_sw()
    init_mcp()
def init_mcp():
    global mcp_devadr
    mcp_devadr = 32
    set_dir(0, 255)
    set_dir(1, 255)
    set_pull(0, 240)
    set_pull(0, 255)
def read_dig(bank2: number):
    global rbank
    rbank = bank2 + 18
    pins.i2c_write_number(mcp_devadr, rbank, NumberFormat.UINT8_LE, True)
    return pins.i2c_read_number(mcp_devadr, NumberFormat.UINT8_LE, False)
def set_pull(bank3: number, data: number):
    global pbank
    pbank = bank3 + 12
    pins.i2c_write_number(mcp_devadr, pbank, NumberFormat.UINT8_LE, True)
    pins.i2c_write_number(mcp_devadr, data, NumberFormat.UINT8_LE, False)
pbank = 0
rbank = 0
mcp_devadr = 0
value = 250
init_all()

def on_forever():
    basic.pause(500)
    if value & 0x02:
        basic.show_icon(IconNames.COW)
    if pins.digital_read_pin(DigitalPin.P13) == 0:
        basic.show_icon(IconNames.GIRAFFE)
    else:
        basic.show_icon(IconNames.DIAMOND)
    serial.write_line("joy")
    serial.write_value("p1", pins.analog_read_pin(AnalogPin.P1))
    serial.write_value("p2", pins.analog_read_pin(AnalogPin.P2))
    serial.write_line("sw")
    serial.write_value("p0", pins.digital_read_pin(DigitalPin.P0))
    serial.write_value("p5", pins.digital_read_pin(DigitalPin.P5))
    serial.write_value("p8", pins.digital_read_pin(DigitalPin.P8))
    serial.write_value("p12", pins.digital_read_pin(DigitalPin.P12))
    serial.write_value("p13", pins.digital_read_pin(DigitalPin.P13))
    serial.write_value("p14", pins.digital_read_pin(DigitalPin.P14))
    serial.write_value("p15", pins.digital_read_pin(DigitalPin.P15))
    serial.write_value("p16", pins.digital_read_pin(DigitalPin.P16))
    serial.write_line("ioexp")
    serial.write_value("b0", read_dig(0))
    serial.write_value("b1", read_dig(1))
basic.forever(on_forever)
