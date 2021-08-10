export type TabIdentity = string | number;

export interface TabChangeEvent {
    id: TabIdentity;
    index: number;
}

export interface TabClickEvent extends TabChangeEvent {
    nativeEvent: Event;
}
