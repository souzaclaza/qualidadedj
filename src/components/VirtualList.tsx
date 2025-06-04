import React from 'react';
import { List, AutoSizer, ListRowProps } from 'react-virtualized';

interface VirtualListProps<T> {
  items: T[];
  rowHeight: number;
  renderRow: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function VirtualList<T>({ 
  items, 
  rowHeight, 
  renderRow, 
  className 
}: VirtualListProps<T>) {
  const rowRenderer = ({ index, style }: ListRowProps) => (
    <div style={style}>
      {renderRow(items[index], index)}
    </div>
  );

  return (
    <div className={className} style={{ height: '100%' }}>
      <AutoSizer>
        {({ width, height }) => (
          <List
            width={width}
            height={height}
            rowCount={items.length}
            rowHeight={rowHeight}
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
    </div>
  );
}