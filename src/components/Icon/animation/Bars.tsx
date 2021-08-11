import React from 'react';
import { IconDefinition } from '../../../types';

export const bars: IconDefinition = {
    title: 'animation-bars',
    width: 135,
    height: 140,
    raw: (
        <>
            <rect y="10" width="15" height="120" rx="6" fill="currentColor">
                <animate
                    attributeName="height"
                    begin="0.5s"
                    dur="1s"
                    values="120;110;100;90;80;70;60;50;40;140;120"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="y"
                    begin="0.5s"
                    dur="1s"
                    values="10;15;20;25;30;35;40;45;50;0;10"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
            </rect>
            <rect x="30" y="10" width="15" height="120" rx="6" fill="currentColor">
                <animate
                    attributeName="height"
                    begin="0.25s"
                    dur="1s"
                    values="120;110;100;90;80;70;60;50;40;140;120"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="y"
                    begin="0.25s"
                    dur="1s"
                    values="10;15;20;25;30;35;40;45;50;0;10"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
            </rect>
            <rect x="60" width="15" height="140" rx="6" fill="currentColor">
                <animate
                    attributeName="height"
                    begin="0s"
                    dur="1s"
                    values="120;110;100;90;80;70;60;50;40;140;120"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="y"
                    begin="0s"
                    dur="1s"
                    values="10;15;20;25;30;35;40;45;50;0;10"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
            </rect>
            <rect x="90" y="10" width="15" height="120" rx="6" fill="currentColor">
                <animate
                    attributeName="height"
                    begin="0.25s"
                    dur="1s"
                    values="120;110;100;90;80;70;60;50;40;140;120"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="y"
                    begin="0.25s"
                    dur="1s"
                    values="10;15;20;25;30;35;40;45;50;0;10"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
            </rect>
            <rect x="120" y="10" width="15" height="120" rx="6" fill="currentColor">
                <animate
                    attributeName="height"
                    begin="0.5s"
                    dur="1s"
                    values="120;110;100;90;80;70;60;50;40;140;120"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="y"
                    begin="0.5s"
                    dur="1s"
                    values="10;15;20;25;30;35;40;45;50;0;10"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
            </rect>
        </>
    ),
};
