export const IsFocusVisibleClassName = 'suit--is-focus-visible';
export const IsFocusHiddenClassName = 'suit--is-focus-hidden';

/**
 * focus 스타일의 표시를 설정한다.
 *
 * 기본적으로, focus 스타일(예를 들어 Button의 surrounding box 표시)은 
 * 방향 혹은 이동키(Tab, arrows, PgUp/PgDn, Home and End)를 눌렀을 때 보여지며, 
 * 마우스 클릭 시에는 숨겨진다.
 * 해당 함수는 이 기능을 on/off 할 수 있다.
 *
 * @param enabled - whether to remove or add focus
 */
export function setFocusVisibility(enabled: boolean): void {
    const win = window;

    if (win) {
        const { classList } = win.document.body;
        classList.add(enabled ? IsFocusVisibleClassName : IsFocusHiddenClassName);
        classList.remove(enabled ? IsFocusHiddenClassName : IsFocusVisibleClassName);
    }
}
