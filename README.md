# Strobe tuner
Simulation of a [stroboscopic tuner](https://en.wikipedia.org/wiki/Electronic_tuner#Strobe_tuners), the most accurate type of tuner, written in ReactJS and Rust (compiled to WASM, for the more computationally demanding parts).

## How to use
Follow [this link](https://frun36.github.io/strobe-tuner/) to try the tuner out. You first need to grant the app microphone permissions. Then you can select a tuning mode from the list of available tuning modes, incl.:
* 12TET - regular chromatic ([12 tone equal temperament](https://en.wikipedia.org/wiki/12_equal_temperament)) tuner
* Guitar E Standard - standard EADGBE guitar tuning
* Guitar Eb - standard tuning lowered by a half step
* Guitar E James Taylor - the James Taylor tuning for a guitar, standard EADGBE tuning compensated for the inaccuracies of the instrument 
* Soprano Ukulele - standard gCEA tuning
* Violin/Viola - tuning for violin/viola, constructed with [just intonated fifths](https://en.wikipedia.org/wiki/Just_intonation), with A as the starting pitch
* Single - a single note for manual tuning
The tuner will then automatically detect which note you are playing, and match the wheel frequency accordingly.

The tuner display consists of two sections - a strobe wheel, and below it a helper bar with a moving needle. The goal of the tuning process is to make the strobe wheel appear as stationary as possible. If the wheel is spinning clockwise, that means your note is too sharp and you need to tune it down. If it is spinning counter-clockwise, your note is too flat and you need to tune up. The helper bar is meant to assist you in the process of tuning, especially when the pitch difference is so high that the wheel goes crazy. It doesn't provide much accuracy though, and should only be used as additional support.

### Advanced usage
The tuner enables you to perform additional configuration, should you wish to make fine adjustments to any of the provided tunings.

#### Reference pitch
For starters, you can change the reference pitch for A<sub>4</sub> from the default 440 Hz to one of your liking, such as the infamous 432 Hz.

#### Note cards
Below the reference pith settings, you can see cards representing notes that the tuner is set to detect. They allow you to:
* **Enable/disable** a note's detection through a checkbox it the top-right corner
* **Change a note's name**, which is displayed in the helper bar
* **Set the offset from the reference pitch** (in cents, 1/100 of a semitone)
* **Set the allowed octaves** for a note, in which the tuner will detect the note

#### General settings
* **Input gain** - the input gain of the tuner (in dB)
* **Enable bandpass filter** - enables/disables the bandpass filter, which is automatically placed around the detected note and helps the strobe wheel calculate its position in a more readable way.
* **Filter q** - q parameter of the aforementioned bandpass filter

## ToDo
* "How it works" section in README.md
* Refactor Rust code
* Improve pitch detection for more stability and precision
* Allow user to add notes to tunings
* Improve JS -> WASM memory access to minimise data copying
* Optimise React hooks and rerenders (potential increase in performance)
* Turn the app into a PWA