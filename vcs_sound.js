
// # HEX  D3 D2 D1 D0    Clock Source    Clock Modifier    Source Pattern
// # --- -------------  --------------  ----------------  ----------------
// #  0    0  0  0  0    3.58 MHz/114 ->  none  (pure)  ->      none
// #  1    0  0  0  1    3.58 MHz/114 ->  none  (pure)  ->   4-bit poly
// #  2    0  0  1  0    3.58 MHz/114 ->  divide by 31  ->   4-bit poly
// #  3    0  0  1  1    3.58 MHz/114 ->   5-bit poly   ->   4-bit poly
// #  4    0  1  0  0    3.58 MHz/114 ->  none  (pure)  ->   pure  (~Q)
// #  5    0  1  0  1    3.58 MHz/114 ->  none  (pure)  ->   pure  (~Q)
// #  6    0  1  1  0    3.58 MHz/114 ->  divide by 31  ->   pure  (~Q)
// #  7    0  1  1  1    3.58 MHz/114 ->   5-bit poly   ->   pure  (~Q)
// #  8    1  0  0  0    3.58 MHz/114 ->  none  (pure)  ->   9-bit poly
// #  9    1  0  0  1    3.58 MHz/114 ->  none  (pure)  ->   5-bit poly
// #  A    1  0  1  0    3.58 MHz/114 ->  divide by 31  ->   5-bit poly
// #  B    1  0  1  1    3.58 MHz/114 ->   5-bit poly   ->   5-bit poly
// #  C    1  1  0  0    1.19 MHz/114 ->  none  (pure)  ->   pure  (~Q)
// #  D    1  1  0  1    1.19 MHz/114 ->  none  (pure)  ->   pure  (~Q)
// #  E    1  1  1  0    1.19 MHz/114 ->  divide by 31  ->   pure  (~Q)
// #  F    1  1  1  1    1.19 MHz/114 ->   5-bit poly   ->   pure  (~Q)

//# TIASOUND emulation package by Ron Fry
//# from ATARI 2600 VCS SOUND FREQUENCY AND WAVEFORM GUIDE by Eckhard Stolberg
//# Atari 2600 Music And Sound Programming Guide by Paul Slocum
//# The Atari 2600 Music and Sound Page, Random Terrain
//# Distortion Table AUDC0 and AUDC1 control register
//# All scalled for pixelclock/114
//# 0 = 1 (always high)
//# 11 = 1
//# 1 = 001010000111011 (Saw     sounds similar to a saw waveform)
//# 2 = 001010000111011->0100000000000000000100000000000 (465 bits long)
//#(Engine  many 2600 games use this for an engine sound)
//# 3 = 001010000111011->0010110011111000110111010100001 (465 bits long)
//# 4 = 01 (Square  a high pitched square waveform)
//# 5 = 01
//# 6 = 1111111111111000000000000000000 (Bass    fat bass sound)
//# 10 = 1111111111111000000000000000000
//# 7 = 0010110011111000110111010100001 (Pitfall log sound in pitfall
//#, low and buzzy)
//# 9 = 0010110011111000110111010100001
//# 8 = 511 bits long (white noise) (Noise   white noise)

//# 12 through 15 use CPUclock/114 so stretch each bit by 3 to make
//# pixelclock/114 compatable
//# 12 = 10 (Lead    lower pitch square wave sound)
//# 13 = 10
//# 14 = 1111111111111000000000000000000
//# 15 = 0010110011111000110111010100001 (Buzz atonal buzz, good for percussion)


// 3.58MHz clock divided by 114
var pixelclock = 3580000.0;
// CPUclock = pixelclock/3
var f1 = pixelclock / 114.0;

// from TiaSound.c

var POLY1_SIZE = 2;
var POLY4_SIZE = 15;
var POLY5_SIZE = 31;
var POLY9_SIZE = POLY4_SIZE * POLY5_SIZE;

var audc_empty_poly1 = new Float32Array(POLY1_SIZE);
var audc_empty_poly4 = new Float32Array(POLY4_SIZE);
var audc_empty_poly5 = new Float32Array(POLY5_SIZE);
var audc_empty_poly9 = new Float32Array(POLY9_SIZE);

var aud_length = [POLY1_SIZE, POLY4_SIZE, POLY4_SIZE, POLY9_SIZE, POLY1_SIZE, POLY1_SIZE, POLY5_SIZE, POLY5_SIZE, POLY9_SIZE, POLY5_SIZE, POLY5_SIZE, POLY1_SIZE, POLY1_SIZE, POLY5_SIZE, POLY5_SIZE, POLY5_SIZE];


// 02, 06, 10, 14 x 31
var aud_clk = [1, 1, POLY5_SIZE, 1, 1, 1, 1, 1, 1, 1, POLY5_SIZE, 1, 3, 3, 3, 3];

var audc_00_11 = new Float32Array([1, 1]);
var audc_01_02 = new Float32Array([0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1]);// 02 is div31
var audc_03 = new Float32Array(POLY9_SIZE);
var audc_04_05 = new Float32Array([0, 1]);
var audc_06_10_14 = new Float32Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
var audc_07_09_15 = new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1]);
var audc_08 = new Float32Array(POLY9_SIZE);
// div 3 clock
var audc_12_13 = new Float32Array([0, 1]);

var p = 0;
var q = 0;

for (p = 0; p < POLY9_SIZE; p += 1) {
    audc_08[p] = (Math.round(Math.random()));
}

for (p = 0; p < POLY5_SIZE; p += 1) {
    for (q = 0; q < POLY4_SIZE; q += 1) {
        if (audc_07_09_15[p] === 1) {
            audc_03[p * POLY5_SIZE + q] = audc_01_02[q];
        } else {
            audc_03[p * POLY5_SIZE + q] = 0;
        }
    }
}



// create web audio api context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();


function frequency(audc, audf) {
    var sctrl = (audc & 0x0F);
    var sfreq = (audf & 0x1F) + 1;
    return Math.trunc(f1 / sfreq / aud_length[sctrl] / aud_clk[sctrl]);    
}


function waveform(audc) {
    var sound_data = [];
    var sctrl = (audc & 0x0F);

    switch (sctrl) {
    case 0:
    case 11:
        sound_data = audc_00_11;
        break;
    case 1:
    case 2:
        sound_data = audc_01_02;
        break;
    case 3:
        sound_data = audc_03;
        break;
    case 4:
    case 5:
        sound_data = audc_04_05;
        break;
    case 6:
    case 10:
    case 14:
        sound_data = audc_06_10_14;
        break;
    case 7:
    case 9:
    case 15:
        sound_data = audc_07_09_15;
        break;
    case 8:
        sound_data = audc_08;
        break;
    case 12:
    case 13:
        sound_data = audc_12_13;
        break;
    }
    return sound_data;
}



function Sound(audv, audf, audc, audt) {
    this.audv = audv;
    this.audf = audf;
    this.audc = audc;
    this.audt = audt;

    var number_of_sounds = audf.length;
    var buffer = [];
    var wave_form = 0;
    var wave_form_length = 0;
    var freq_param = 0;
    var sequence_length = 0; 
    var repeat_length = 0;
    var wave_form_counter = 0;
    var repeat_counter = 0;

    var buffer_length = 0;

    var buffer_index = 0;

    for (var j = 0; j < number_of_sounds; j++) {

        buffer_length = Math.floor(audioCtx.sampleRate * this.audt[j]);

        wave_form = waveform(this.audc[j]);
        wave_form_length = wave_form.length;

        freq_param = frequency(this.audc[j], this.audf[j]);


        sequence_length = audioCtx.sampleRate / freq_param; 

        repeat_length = sequence_length / wave_form_length;


        wave_form_counter = 0;
        repeat_counter = 0;

        for (var i = 0; i < buffer_length; i++) {
            buffer_index++
            repeat_counter++;
            if (repeat_counter >= repeat_length) {
                repeat_counter = 0;

                wave_form_counter++;
                if (wave_form_counter >= wave_form_length) {
                    wave_form_counter = 0;
                }
            }

            buffer[buffer_index] = wave_form[wave_form_counter] * 2 - 1;
        }

    }

    var buffer_total = buffer_index + 1;

    this.myArrayBuffer = audioCtx.createBuffer(1, buffer_total , audioCtx.sampleRate);

    this.gainNode = audioCtx.createGain();

    this.nowBuffering = this.myArrayBuffer.getChannelData(0);


    for (var i = 0; i < buffer_total; i++) {

        this.nowBuffering[i] = buffer[i];
    }


    // Get an AudioBufferSourceNode.
    // This is the AudioNode to use when we want to play an AudioBuffer
    this.source = audioCtx.createBufferSource();
    // set the buffer in the AudioBufferSourceNode
    this.source.buffer = this.myArrayBuffer;
    // connect the AudioBufferSourceNode to the

    this.source.connect(this.gainNode);
    // destination so we can hear the sound
    this.gainNode.connect(audioCtx.destination);

    this.gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    // start the source playing
    this.source.start();


}


Sound.prototype.play = function() {
   //"""Sound play function.""" 

    this.source = audioCtx.createBufferSource();
    // set the buffer in the AudioBufferSourceNode
    this.source.buffer = this.myArrayBuffer;
    // connect the AudioBufferSourceNode to the

    this.source.connect(this.gainNode);
    // destination so we can hear the sound
    this.gainNode.connect(audioCtx.destination);

    this.gainNode.gain.setValueAtTime(this.audv, audioCtx.currentTime);
    
    // start the source playing
    this.source.start();
}


Sound.prototype.stop = function() {
    //"""Sound play function."""  
    this.source.stop();
}


