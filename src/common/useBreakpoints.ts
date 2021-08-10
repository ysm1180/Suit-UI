import { useLayoutEffect, useState } from 'react';
import { breakpointPixels, Breakpoints } from './css';

export default function useBreakpoints<T extends string | number | symbol>(breakpoints: Breakpoints<T>) {
    const [matchValue, setMatchValue] = useState(() => {
        if (typeof breakpoints !== 'object') {
            return breakpoints;
        }

        const xl = matchMedia(`(min-width:${breakpointPixels.xl}px)`).matches;
        const lg = matchMedia(`(min-width:${breakpointPixels.lg}px)`).matches;
        const md = matchMedia(`(min-width:${breakpointPixels.md}px)`).matches;
        const sm = matchMedia(`(min-width:${breakpointPixels.sm}px)`).matches;

        if (xl) {
            return breakpoints.xl;
        } else if (lg) {
            return breakpoints.lg;
        } else if (md) {
            return breakpoints.md;
        } else if (sm) {
            return breakpoints.sm;
        } else {
            return breakpoints.xs;
        }
    });

    useLayoutEffect(() => {
        let active = true;

        const xlQueryList = matchMedia(`(min-width:${breakpointPixels.xl}px)`);
        const lgQueryList = matchMedia(`(min-width:${breakpointPixels.lg}px)`);
        const mdQueryList = matchMedia(`(min-width:${breakpointPixels.md}px)`);
        const smQueryList = matchMedia(`(min-width:${breakpointPixels.sm}px)`);

        const updateMatch = () => {
            if (active) {
                let value: T | undefined = undefined;
                if (typeof breakpoints !== 'object') {
                    value = breakpoints;
                } else {
                    if (xlQueryList.matches) {
                        value = breakpoints.xl;
                    } else if (lgQueryList.matches) {
                        value = breakpoints.lg;
                    } else if (mdQueryList.matches) {
                        value = breakpoints.md;
                    } else if (smQueryList.matches) {
                        value = breakpoints.sm;
                    } else {
                        value = breakpoints.xs;
                    }
                }

                setMatchValue(value);
            }
        };
        updateMatch();

        xlQueryList.addEventListener('change', updateMatch);
        lgQueryList.addEventListener('change', updateMatch);
        mdQueryList.addEventListener('change', updateMatch);
        smQueryList.addEventListener('change', updateMatch);

        return () => {
            active = false;

            xlQueryList.removeEventListener('change', updateMatch);
            lgQueryList.removeEventListener('change', updateMatch);
            mdQueryList.removeEventListener('change', updateMatch);
            smQueryList.removeEventListener('change', updateMatch);
        };
    }, [breakpoints]);

    return matchValue;
}
