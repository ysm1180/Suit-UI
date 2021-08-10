import { ReactElement } from 'react';

export interface IconDefinition {
    title: string;
    width: number;
    height: number;
    pathData?: string;
    raw?: ReactElement;
}
