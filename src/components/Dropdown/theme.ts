export interface DropdownDefaultTheme {
    backgroundColor?: string;
    borderColor?: string;
    color?: string;
    focusColor?: string;
    list: {
        backgroundColor?: string;
        selectedItemColor?: string;
        selectedItemBackgroundColor?: string;
        hoverItemBackgroundColor?: string;
    };
}

export const DropdownLightTheme: DropdownDefaultTheme = {
    borderColor: '#222426',
    color: '#333333',
    focusColor: '#dddddd',
    list: {
        backgroundColor: '#FFFFFF',
        selectedItemBackgroundColor: '#F7F7F7',
        hoverItemBackgroundColor: '#F2F2F2',
    },
};

export const DropdownDarkTheme: DropdownDefaultTheme = {
    borderColor: '#626466',
    color: '#dddddd',
    focusColor: '#666666',
    list: {
        backgroundColor: '#333333',
        selectedItemColor: '#DDDDDD',
        selectedItemBackgroundColor: '#676767',
        hoverItemBackgroundColor: '#626262',
    },
};
