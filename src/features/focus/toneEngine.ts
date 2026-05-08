export type AmbientHandle = {
  stop: () => void
}

const progressions = {
  forest: ['C3', 'G3', 'D4', 'E4'],
  lofi: ['A2', 'E3', 'C4', 'B3'],
  rainline: ['D3', 'A3', 'F4', 'C4'],
}

export async function startAmbient(soundscape: keyof typeof progressions): Promise<AmbientHandle> {
  const Tone = await import('tone')
  await Tone.start()

  const reverb = new Tone.Reverb({ decay: 7, wet: 0.42 }).toDestination()
  const filter = new Tone.Filter({ frequency: 900, type: 'lowpass' }).connect(reverb)
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' },
    envelope: { attack: 1.2, decay: 0.6, sustain: 0.6, release: 3.8 },
  }).connect(filter)
  const noise = new Tone.Noise('pink').connect(new Tone.Volume(-28).connect(reverb))
  const loop = new Tone.Loop((time) => {
    const notes = progressions[soundscape]
    const note = notes[Math.floor(Math.random() * notes.length)]
    synth.triggerAttackRelease(note, '2n', time, 0.16)
  }, '2n')

  noise.start()
  loop.start(0)
  Tone.Transport.bpm.value = soundscape === 'lofi' ? 64 : 48
  Tone.Transport.start()

  return {
    stop() {
      loop.stop()
      loop.dispose()
      noise.stop()
      noise.dispose()
      synth.dispose()
      filter.dispose()
      reverb.dispose()
    },
  }
}
