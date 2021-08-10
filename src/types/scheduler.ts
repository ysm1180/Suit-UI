export interface SchedulerTimelineData {
    key: string;
    start: Date;
    end: Date;
    category: string;
    text: string;
    visible: boolean;
    description?: string[];
    descriptionTitle?: string;
    order?: number;
    selected?: boolean;
    error?: boolean;
}

export interface SchedulerDayData {
    text: string;
    current: boolean;
    now?: boolean;
}

export interface SchedulerWeekData {
    week: number;
    startDay: Date;
    days: SchedulerDayData[];
    endDay: Date;
}
