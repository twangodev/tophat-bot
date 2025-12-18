import React from 'react';
import { Box, Text } from 'ink';
import { Divider } from '@/ui/Divider';
import figlet from 'figlet';
import gradient from 'gradient-string';

export function Banner() {
  const ascii = figlet.textSync('TopHat Bot', { font: 'ANSI Shadow' });
  const gradientAscii = gradient(['#6820C5', '#934AF4', '#C59AFA'])(ascii);

  return (
    <Box flexDirection="column">
      <Text>{gradientAscii}</Text>
      <Text color="yellow" bold>⚠  USE AT YOUR OWN RISK</Text>
      <Divider color="yellow" />
      <Text dimColor>  • Verify this complies with applicable ToS</Text>
      <Text dimColor>  • You assume all responsibility for usage</Text>
      <Divider color="yellow" />
      <Text> </Text>
    </Box>
  );
}