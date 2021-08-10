export interface RadioChangeEvent {
    target: HTMLInputElement;
    stopPropagation: () => void;
    preventDefault: () => void;
    nativeEvent: Event;
}
