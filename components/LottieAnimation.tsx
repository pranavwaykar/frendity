'use client'

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import type { LottieComponentProps } from 'lottie-react';

interface LottieAnimationProps extends Partial<LottieComponentProps> {
    path: string;
    className?: string;
}

// Define a type for Lottie animation data
interface LottieAnimationData {
    v: string;
    fr: number;
    ip: number;
    op: number;
    w: number;
    h: number;
    nm: string;
    ddd: number;
    assets: unknown[];
    layers: unknown[];
}

export const LottieAnimation = ({ path, className, ...props }: LottieAnimationProps) => {
    const [animationData, setAnimationData] = useState<LottieAnimationData | null>(null);

    useEffect(() => {
        fetch(path)
            .then(response => response.json())
            .then(data => setAnimationData(data))
            .catch(error => console.error('Error loading animation:', error));
    }, [path]);

    if (!animationData) {
        return null;
    }

    return (
        <div className={className}>
            <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
                {...props}
            />
        </div>
    );
};
