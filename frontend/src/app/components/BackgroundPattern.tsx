import React from 'react'
import Image from 'next/image'

const BackgroundPattern = () => {
    return (
        <Image
            src="/image/background.png"
            alt="Background"
            fill
            className="absolute inset-0 object-cover object-center opacity-30 z-0 scale-150"
            priority
        />
    )
}

export default BackgroundPattern