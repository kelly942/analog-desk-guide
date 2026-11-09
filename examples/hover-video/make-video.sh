#!/bin/sh
# Turn a video of an object on a near-white background into one that blends cleanly into a white page.
# Usage: ./make-video.sh input.mp4 output.mp4 [crop]
#   crop (optional) is ffmpeg's width:height:x:y, e.g. 600:600:100:40, to trim to the object.
# What it does:
#   1. Pushes every near-white pixel (245 or brighter) to pure white, so the video's background matches the page exactly.
#   2. Optionally crops to the object.
#   3. Makes an mp4 that plays everywhere (H.264, no sound, fast start).
# On the page, mix-blend-mode: multiply makes the white disappear. Multiply only removes WHITE, so a video that isn't pure
# white leaves a visible box around the object. That is what step 1 prevents.
set -e
IN="$1"; OUT="$2"; CROP="$3"
[ -n "$IN" ] && [ -n "$OUT" ] || { echo "usage: $0 input.mp4 output.mp4 [w:h:x:y]"; exit 1; }
VF="lutrgb=r='if(gte(val,245),255,val)':g='if(gte(val,245),255,val)':b='if(gte(val,245),255,val)'"
[ -n "$CROP" ] && VF="crop=$CROP,$VF"
# scale=out_range=full + -color_range pc keeps white at exactly 255. The default (limited range) turns it into about 253, which shows as a faint box.
ffmpeg -y -loglevel error -i "$IN" -an -vf "$VF,scale=out_range=full" -c:v libx264 -pix_fmt yuv420p -crf 20 -color_range pc -movflags +faststart "$OUT"
# A poster image shows before the video plays (and for people who prefer reduced motion).
ffmpeg -y -loglevel error -i "$OUT" -frames:v 1 -update 1 "${OUT%.*}.jpg"
echo "wrote $OUT and ${OUT%.*}.jpg"
