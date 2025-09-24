'use client'

interface TimerSettingProps {
  currentTimer: number
  onTimerChange: (seconds: number) => void
}

export default function TimerSetting({ currentTimer, onTimerChange }: TimerSettingProps) {
  const timerOptions = [0, 3, 5, 10]

  const handleTimerChange = (seconds: number) => {
    onTimerChange(seconds)
  }

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Timer Foto</h3>
      <div className="grid grid-cols-4 gap-2">
        {timerOptions.map((seconds) => (
          <button
            key={seconds}
            onClick={() => handleTimerChange(seconds)}
            className={`
              py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
              ${currentTimer === seconds 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {seconds === 0 ? 'Instant' : `${seconds}s`}
          </button>
        ))}
      </div>
    </div>
  )
}
