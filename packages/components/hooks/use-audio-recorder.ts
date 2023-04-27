import { useEffect, useRef, useState } from 'react'

type RecorderControls = {
  analyser: AnalyserNode | null
  startRecording: () => void
  stopRecording: () => void
  deleteRecording: () => void
  audioBlob?: Blob
  isRecording: boolean
  recordingTime: number
}

/**
 * A React hook that provides a set of methods to control audio recording
 * @returns {RecorderControls} An object containing the following properties:
 * - `analyser`: An `AnalyserNode` instance that can be used to analyze the audio stream
 * - `startRecording`: A method that starts the recording
 * - `stopRecording`: A method that stops the recording
 * - `deleteRecording`: A method that deletes the recorded audio
 * - `tooglePlayPause`: A method that toggles between playing and pausing the recorded audio
 * - `audioBlob`: A `Blob` instance containing the recorded audio
 * - `isRecording`: A boolean value indicating whether the recording is in progress
 * - `isPlaying`: A boolean value indicating whether the recorded audio is being played
 * - `recordingTime`: A number indicating the time in seconds for which the recording has been in progress
 **/

const useAudioRecorder = (): RecorderControls => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>()
  const timeIntervalRef = useRef<NodeJS.Timer | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob>()
  const analyserRef = useRef<AnalyserNode | null>(null)
  const [shouldDelete, setShouldDelete] = useState(false)

  const startTimer: () => void = () => {
    timeIntervalRef.current = setInterval(() => {
      setRecordingTime(time => time + 1)
    }, 1000)
  }

  const stopTimer: () => void = () => {
    timeIntervalRef.current && clearInterval(timeIntervalRef.current)
    timeIntervalRef.current = null
  }

  /**
   * Calling this method would result in the recording to start. Sets `isRecording` to true
   */
  const startRecording: () => void = () => {
    if (timeIntervalRef.current !== null) return

    const audioContext = new AudioContext()

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        setIsRecording(true)
        const recorder: MediaRecorder = new MediaRecorder(stream)
        setMediaRecorder(recorder)
        recorder.start()

        startTimer()

        // Audio analysis
        const source = audioContext.createMediaStreamSource(stream)
        const analyser = audioContext.createAnalyser()

        analyser.fftSize = 256

        source.connect(analyser)

        analyserRef.current = analyser

        // Recording
        recorder.addEventListener('dataavailable', event => {
          setAudioBlob(event.data)
          recorder.stream.getTracks().forEach(t => t.stop())
          setMediaRecorder(null)

          audioContext.close()
        })
      })
      .catch(err => {
        // TODO: Handle error
        console.log(err)
      })
  }

  /**
   * Calling this method results in a recording in progress being stopped and the resulting audio being present in `audioBlob`. Sets `isRecording` to false
   */
  const stopRecording = () => {
    if (mediaRecorder?.state === 'recording') {
      mediaRecorder?.stop()
    }
    stopTimer()
    setRecordingTime(0)
    setIsRecording(false)

    // Delay the deletion of the recording
    setTimeout(() => {
      if (!shouldDelete) return
      deleteRecording()
    }, 100)
  }
  /**
   * Calling this method results in deleting the recorded audio
   */

  const deleteRecording = () => {
    stopRecording()
    setShouldDelete(true)
  }

  useEffect(() => {
    if (shouldDelete && !isRecording && audioBlob) {
      setAudioBlob(undefined)
      setShouldDelete(false)
    }
  }, [shouldDelete, isRecording, audioBlob])

  useEffect(() => {
    return () => clearInterval(timeIntervalRef.current as NodeJS.Timer)
  }, [])

  return {
    analyser: analyserRef.current,
    deleteRecording,
    startRecording,
    stopRecording,
    audioBlob,
    isRecording,
    recordingTime,
  }
}

export { useAudioRecorder }
