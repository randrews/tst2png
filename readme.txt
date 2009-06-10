tst2png

Converter from the TST tilesheet format (created by Christopher B. Matthews) to PNG files (with transparency).

Requirements: a JVM.

To use, run tst2png with a list of tst files. Before the tst files, you can put option flags.

Available options:

-columns <num>
Specify how many tiles should be in each row on the generated PNGs. Default 8.

-verbose <true/false>
Print out information about the files as you convert them. Default is true.

-overwrite <true/false>
Overwrite PNG files if they already exist. Default is false.

-transparent <color>
Takes a hex triplet for a color, and that color is replaced with transparent pixels (in addition to the transparent color defined in the TST file specification)

-border <true/false>
Used only with "-transparent". If true, then only transparent pixels that are not next to colored pixels will be replaced, leaving a nice border around the icons. Handy if black is transparent, not so handy if purple is transparent.

-scale <num>
Scales the image to some multiple of its size. Scale 2 with 32x32 tiles will make them 64x64, etc. Scale must be 1 or greater. (default 1, of course)

-process <true/false>
If set to "false", tst2png will only print header information, not actually convert the files. Default is true.
