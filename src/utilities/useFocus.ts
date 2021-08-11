import { useEffect } from 'react';
import { isDirectionalKeyCode } from './keyboard';
import { setFocusVisibility } from './setFocusVisibility';

const mountCounters = new WeakMap<Window, number>();

/**
 * Counter for mounted component that uses focus.
 *
 * useFocus를 사용하는 마지막 컴포넌트가 unmount 되기 전 listner들을 cleanup 할 때 사용한다.
 */
function setMountCounters(key: Window, delta: number): number {
    let newValue;
    const currValue = mountCounters.get(key);
    if (currValue) {
        newValue = currValue + delta;
    } else {
        newValue = 1;
    }

    mountCounters.set(key, newValue);
    return newValue;
}

/**
 * 1. keydown, mousedown 이벤트들을 subscribe 한다. (window 마다 한번만 이루어진다.)
 * 2. 방향키나 이동키를 누를 때 suit--is-focus-visible classname이 document body에 추가되고,
 *    suit--is-focus-hidden classname이 제거된다.
 * 3. 마우스 클릭 시 suit--is-focus-hidden classname 이 document body에 추가되고,
 *    suit--is-focus-visible classname이 제거된다.
 */
export function useFocus(): void {
    useEffect(() => {
        const win = window;

        if (!win) {
            return undefined;
        }

        let count = setMountCounters(win, 1);
        if (count <= 1) {
            win.addEventListener('mousedown', _onMouseDown, true);
            win.addEventListener('pointerdown', _onPointerDown, true);
            win.addEventListener('keydown', _onKeyDown, true);
        }

        return () => {
            if (!win) {
                return;
            }

            count = setMountCounters(win, -1);
            if (count === 0) {
                win.removeEventListener('mousedown', _onMouseDown, true);
                win.removeEventListener('pointerdown', _onPointerDown, true);
                win.removeEventListener('keydown', _onKeyDown, true);
            }
        };
    }, []);
}

function _onMouseDown(): void {
    setFocusVisibility(false);
}

function _onPointerDown(ev: PointerEvent): void {
    if (ev.pointerType !== 'mouse') {
        setFocusVisibility(false);
    }
}

function _onKeyDown(ev: KeyboardEvent): void {
    if (isDirectionalKeyCode(ev.key)) {
        setFocusVisibility(true);
    }
}
