import React from 'react';
import { Box } from 'ink';

interface DividerProps {
  color?: string;
}

export function Divider({ color = 'yellow' }: DividerProps) {
  return (
    <Box
      width="100%"
      borderStyle="single"
      borderTop={true}
      borderBottom={false}
      borderLeft={false}
      borderRight={false}
      borderColor={color}
    />
  );
}