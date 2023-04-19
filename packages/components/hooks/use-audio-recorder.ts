import { useCallback, useState } from 'react'

export interface recorderControls {
  startRecording: () => void
  stopRecording: () => void
  togglePauseResume: () => void
  recordingBlob?: Blob
  isRecording: boolean
  isPaused: boolean
  recordingTime: number
}

const useAudioRecorder: () => recorderControls = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>()
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timer>()
  const [recordingBlob, setRecordingBlob] = useState<Blob>()

  const startTimer: () => void = () => {
    const interval = setInterval(() => {
      setRecordingTime(time => time + 1)
    }, 1000)
    setTimerInterval(interval)
  }

  const stopTimer: () => void = () => {
    timerInterval != null && clearInterval(timerInterval)
    setTimerInterval(undefined)
  }

  /**
   * Calling this method would result in the recording to start. Sets `isRecording` to true
   */
  const startRecording: () => void = useCallback(() => {
    if (timerInterval != null) return

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        setIsRecording(true)
        const recorder: MediaRecorder = new MediaRecorder(stream)
        setMediaRecorder(recorder)
        recorder.start()
        startTimer()

        recorder.addEventListener('dataavailable', event => {
          setRecordingBlob(event.data)
          recorder.stream.getTracks().forEach(t => t.stop())
          setMediaRecorder(null)
        })
      })
      .catch(err => console.log(err))
  }, [timerInterval])

  /**
   * Calling this method results in a recording in progress being stopped and the resulting audio being present in `recordingBlob`. Sets `isRecording` to false
   */
  const stopRecording: () => void = () => {
    mediaRecorder?.stop()
    stopTimer()
    setRecordingTime(0)
    setIsRecording(false)
    setIsPaused(false)
  }

  /**
   * Calling this method would pause the recording if it is currently running or resume if it is paused. Toggles the value `isPaused`
   */
  const togglePauseResume: () => void = () => {
    if (isPaused) {
      setIsPaused(false)
      mediaRecorder?.resume()
      startTimer()
    } else {
      setIsPaused(true)
      stopTimer()
      mediaRecorder?.pause()
    }
  }

  return {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
  }
}

export { useAudioRecorder }
