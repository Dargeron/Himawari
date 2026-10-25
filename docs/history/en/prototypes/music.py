"""Separate synthesized music sketch. Nothing in the game loads this file.
Run with Python 3, numpy and scipy; no external services or paid generation.
"""
from pathlib import Path
import numpy as np
from scipy.io.wavfile import write

SR=44100
DURATION=32
rng=np.random.default_rng(2464)
mix=np.zeros((int(SR*DURATION),2),dtype=np.float64)

def add(note,start,length,level,pan=0):
    count=min(int(SR*length),len(mix)-int(start*SR))
    if count<=0:return
    t=np.arange(count)/SR;freq=440*2**((note-69)/12)
    # Uneven, softly struck partials suggest a small, imperfect keyboard.
    sound=sum(amp*np.sin(2*np.pi*freq*ratio*t)*np.exp(-t/tau)
              for amp,ratio,tau in [(1,1,1.4),(.35,2.004,.85),(.15,3.016,.5),(.07,4.035,.32)])
    sound*=1-np.exp(-t*450)
    sound+=.015*rng.standard_normal(count)*np.exp(-t*120)
    gains=np.sqrt([(1-pan)/2,(1+pan)/2])
    i=int(start*SR);mix[i:i+count]+=level*sound[:,None]*gains

# A repeating question, gradually taking a less comfortable turn.
phrases=[[57,64,71,72,69,64,60,59],
         [53,60,67,69,71,67,64,60],
         [57,64,71,72,69,65,60,59],
         [52,59,65,68,71,65,59,56]]
for bar,notes in enumerate(phrases):
    for j,note in enumerate(notes):
        add(note,.7+bar*7.5+j*.83,3,.095 if j%2==0 else .072,(-.2 if j%2==0 else .2))
    add([33,29,33,28][bar],.4+bar*7.5,5,.034,-.1)

# A restrained low pulse underneath, suitable for speech rather than loud scares.
t=np.arange(len(mix))/SR
pulse=.007*(1+.2*np.sin(2*np.pi*.13*t))*np.sin(2*np.pi*55*t)
pulse+=.0025*np.sin(2*np.pi*82.7*t)
mix+=pulse[:,None]
# Quiet offset reflections leave room in the center for Harry.
for delay,gain in [(.113,.07),(.247,.045),(.431,.025)]:
    samples=int(delay*SR);mix[samples:]+=mix[:-samples,::-1]*gain
fade=np.minimum(1,t/1.6)*np.minimum(1,(DURATION-t)/2.4)
mix*=fade[:,None]
mix*=.55/max(np.max(np.abs(mix)),.55)
output=Path(__file__).with_name('Himawari-music-prototype.wav')
write(output,SR,(np.clip(mix,-1,1)*32767).astype(np.int16))
print(output)
