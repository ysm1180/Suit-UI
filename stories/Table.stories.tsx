import { Meta, Story } from '@storybook/react';
import React from 'react';
import { Table, Label, TableColumnInfo, TableProps, TableRowValue, TabPanel, Tabs } from '../src';

export default {
    title: 'suit-ui/Table',
    component: Table,
    args: {
        showColumn: true,
        rows: [],
    },
} as Meta;

type ColumnType = 'column1' | 'column2' | 'column3';
const columns: TableColumnInfo<ColumnType>[] = [
    { title: 'type - number', dataIndex: 'column1', type: 'number' },
    { title: 'type - string (center)', dataIndex: 'column2', type: 'string', align: 'center' },
    { title: 'type - percent', dataIndex: 'column3', type: 'percent' },
];
const smallAmountData: TableRowValue<ColumnType>[] = [
    { key: '1', column1: '1', column2: 'string-1', column3: '1' },
    { key: '2', column1: '2', column2: 'string-2', column3: '2' },
    { key: '3', column1: '3', column2: 'string-3', column3: '3.3' },
];

const SimpleTableTemplate: Story<TableProps<ColumnType>> = ({ rows, ...props }) => (
    <Table rows={smallAmountData} {...props} />
);

export const SimpleTable = SimpleTableTemplate.bind({});
SimpleTable.args = {
    columns: columns,
};

export const ThemeDark = SimpleTableTemplate.bind({});
ThemeDark.args = {
    ...SimpleTable.args,
    dark: true,
};
ThemeDark.parameters = {
    backgrounds: {
        default: 'dark',
    },
};

export const ShowGrid = SimpleTableTemplate.bind({});
ShowGrid.args = {
    ...SimpleTable.args,
    showGrid: true,
};

export const Cursor = SimpleTableTemplate.bind({});
Cursor.args = {
    ...SimpleTable.args,
    cursor: 'pointer',
};

export const Loading = SimpleTableTemplate.bind({});
Loading.args = {
    ...SimpleTable.args,
    loading: true,
};

const helpColumns: TableColumnInfo<ColumnType>[] = [
    { title: 'type - number', dataIndex: 'column1', type: 'number', help: true, description: 'it is description' },
    { title: 'type - string (center)', dataIndex: 'column2', type: 'string', align: 'center' },
    { title: 'type - percent', dataIndex: 'column3', type: 'percent' },
];

export const ColumnDescription = SimpleTableTemplate.bind({});
ColumnDescription.args = {
    ...SimpleTable.args,
    columns: helpColumns,
};

const largeAmountData: TableRowValue<ColumnType>[] = [];
for (let i = 1; i < 50; i++) {
    largeAmountData.push({ key: `${i}`, column1: `${i}`, column2: `string ${i % 2}`, column3: `${i}` });
}

const LargeTableTemplate: Story<TableProps<ColumnType>> = ({ rows, ...props }) => (
    <Table rows={largeAmountData} {...props} />
);

export const LimitHeight = LargeTableTemplate.bind({});
LimitHeight.args = {
    columns,
    height: 300,
};

export const RowColor = LargeTableTemplate.bind({});
RowColor.args = {
    ...LimitHeight.args,
    rowBackgroundColor: '#666',
};

export const RowHoverColor = LargeTableTemplate.bind({});
RowHoverColor.args = {
    ...LimitHeight.args,
    rowHoverBackgroundColor: 'yellow',
};

export const SelectableRow = LargeTableTemplate.bind({});
SelectableRow.args = {
    ...RowHoverColor.args,
    cursor: 'pointer',
    selectable: true,
};

const filterColumns: TableColumnInfo<ColumnType>[] = [
    { title: 'type - number', dataIndex: 'column1', type: 'number', filter: true },
    { title: 'type - string', dataIndex: 'column2', type: 'string', filter: true },
    { title: 'type - percent', dataIndex: 'column3', type: 'percent' },
];

export const ColumnFilter = LargeTableTemplate.bind({});
ColumnFilter.args = {
    ...LimitHeight.args,
    columns: filterColumns,
};

const sortableColumns: TableColumnInfo<ColumnType>[] = [
    { title: 'type - number', dataIndex: 'column1', type: 'number', sort: true },
    { title: 'type - string', dataIndex: 'column2', type: 'string', sort: true },
    { title: 'type - percent', dataIndex: 'column3', type: 'percent', sort: true },
];

export const SortableColumn = LargeTableTemplate.bind({});
SortableColumn.args = {
    ...LimitHeight.args,
    columns: sortableColumns,
};

const DescriptionTemplate: Story<TableProps<ColumnType> & { label: string }> = ({ label, rows, ...props }) => (
    <React.Fragment>
        <Label>{label}</Label>
        <Table rows={largeAmountData} {...props} />
    </React.Fragment>
);

const mixedColumns: TableColumnInfo<ColumnType>[] = [
    { title: 'type - number', dataIndex: 'column1', type: 'number', sort: true, filter: true },
    { title: 'type - string', dataIndex: 'column2', type: 'string', sort: true, filter: true },
    { title: 'type - percent', dataIndex: 'column3', type: 'percent', sort: true, filter: true },
];

export const RowFilterColor = DescriptionTemplate.bind({});
RowFilterColor.args = {
    ...LimitHeight.args,
    columns: mixedColumns,
    label: 'when row index is even number, row color is orange',
    rowColorFilter: (rowIndex) => {
        return { background: rowIndex % 2 === 0 && 'orange' };
    },
};

export const RowFilterData = DescriptionTemplate.bind({});
RowFilterData.args = {
    ...LimitHeight.args,
    columns: mixedColumns,
    label: 'show row when the cell data in column1 includes 1',
    filter: (rowData) => {
        return (rowData['column1'] as string).includes('1');
    },
};

const TableWithTabTemplate: Story<TableProps<ColumnType> & { label: string }> = ({ label, rows, ...props }) => (
    <Tabs defaultSelectedId="0">
        <TabPanel id="0" tab="Table 1">
            <Table rows={largeAmountData} width="100%" {...props} />
        </TabPanel>
        <TabPanel id="1" tab="Table 2">
            <Table rows={largeAmountData} width="100%" {...props} />
        </TabPanel>
    </Tabs>
);

export const TableWithTab = TableWithTabTemplate.bind({});
TableWithTab.args = {
    ...LimitHeight.args,
    columns: mixedColumns,
};

const cellDataWithStyle: TableRowValue<ColumnType>[] = [
    {
        key: '1',
        column1: '1',
        column2: 'string-1',
        column3: { content: '1', style: { color: 'red' } },
    },
    {
        key: '2',
        column1: '2',
        column2: { content: 'it is bold', style: { fontWeight: 'bold' } },
        column3: '2',
    },
    { key: '3', column1: { content: '3', style: { backgroundColor: 'gray' } }, column2: 'string-3', column3: '3.3' },
];

const CellWithStyleTableTemplate: Story<TableProps<ColumnType>> = ({ rows, ...props }) => (
    <Table rows={cellDataWithStyle} {...props} />
);

export const CellWithStyle = CellWithStyleTableTemplate.bind({});
CellWithStyle.args = {
    ...LimitHeight.args,
    columns: mixedColumns,
    rowHoverColor: 'yellow',
};

const splitRowData: TableRowValue<ColumnType>[] = [
    {
        key: '1',
        column1: { rows: [{ content: '1' }, { content: '2' }] },
        column2: 'string-1',
        column3: { content: '1', style: { color: 'red' } },
    },
    {
        key: '2',
        column1: '2',
        column2: {
            rows: [
                { content: 'it is bold', style: { fontWeight: 'bold' } },
                { content: 'it is large', style: { fontSize: 19 } },
            ],
        },
        column3: '2',
    },
    { key: '3', column1: '3', column2: 'string-3', column3: '3.3' },
];

const ComplicatedTableTemplate: Story<TableProps<ColumnType>> = ({ rows, ...props }) => (
    <Table rows={splitRowData} {...props} />
);

export const RowsInRow = ComplicatedTableTemplate.bind({});
RowsInRow.args = {
    ...LimitHeight.args,
    columns: mixedColumns,
    rowHoverColor: 'yellow',
};
