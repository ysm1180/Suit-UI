export interface CustomTableTheme {
    column: {
        color?: string;
        backgroundColor?: string;
        hoverBackgroundColor?: string;
    };
    backgroundColor?: string;
    borderColor?: string;
    color?: string;
    row?: {
        selectedBackgroundColor?: string;
    };
}

export const DefaultTableLightTheme: CustomTableTheme = {
    column: {
        backgroundColor: '#FAFAFA',
        hoverBackgroundColor: '#E9E9E9',
    },
    borderColor: '#E8E8E8',
    color: '#333333',
    row: {
        selectedBackgroundColor: '#5B91FF',
    },
};

export const DefaultTableDarkTheme: CustomTableTheme = {
    column: {
        backgroundColor: '#3F3F3F',
        hoverBackgroundColor: '#505050',
    },
    borderColor: '#C2C4C6',
    color: '#dddddd',
    row: {
        selectedBackgroundColor: '#4E76C8',
    },
};
