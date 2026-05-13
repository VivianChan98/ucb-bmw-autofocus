class AudioManager {
  private ctx: AudioContext | null = null
  private ambientNode: OscillatorNode | null = null
  private ambientGain: GainNode | null = null
  private enabled = true

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext()
    }
    return this.ctx
  }

  setEnabled(val: boolean) {
    this.enabled = val
    if (this.ambientGain) {
      this.ambientGain.gain.setTargetAtTime(val ? 0.04 : 0, this.getCtx().currentTime, 0.3)
    }
  }

  startAmbient() {
    if (!this.enabled) return
    const ctx = this.getCtx()
    if (this.ambientNode) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.type = 'sine'
    osc.frequency.value = 82
    filter.type = 'lowpass'
    filter.frequency.value = 200

    gain.gain.value = 0
    gain.gain.setTargetAtTime(0.04, ctx.currentTime, 1.5)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    osc.start()

    this.ambientNode = osc
    this.ambientGain = gain
  }

  stopAmbient() {
    if (this.ambientGain) {
      this.ambientGain.gain.setTargetAtTime(0, this.getCtx().currentTime, 0.5)
    }
    setTimeout(() => {
      this.ambientNode?.stop()
      this.ambientNode = null
      this.ambientGain = null
    }, 1500)
  }

  playMerge() {
    if (!this.enabled) return
    const ctx = this.getCtx()
    const bufferSize = ctx.sampleRate * 0.3
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 400
    filter.Q.value = 0.5
    const gain = ctx.createGain()
    gain.gain.value = 0.15
    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start()
  }

  playChime() {
    if (!this.enabled) return
    const ctx = this.getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.4)
  }

  playPurge() {
    if (!this.enabled) return
    const ctx = this.getCtx()
    const bufferSize = ctx.sampleRate * 0.6
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.5
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(800, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.6)
    const gain = ctx.createGain()
    gain.gain.value = 0.12
    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start()
  }
}

export const audioManager = new AudioManager()
