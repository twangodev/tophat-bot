import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';

interface StatusDisplayProps {
  questionsAnswered?: number;
  lastQuestionTime?: number | null;
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / 60000) % 60;
  const hours = Math.floor(ms / 3600000);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

export function StatusDisplay({ questionsAnswered = 0, lastQuestionTime = null }: StatusDisplayProps) {
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [shimmerPos, setShimmerPos] = useState(0);
  const [direction, setDirection] = useState(1);

  const baseText = 'Waiting for questions';

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Date.now() - startTime);
      setShimmerPos((pos) => {
        const newPos = pos + direction;
        if (newPos >= baseText.length + 3) {
          setDirection(-1);
          return newPos;
        } else if (newPos <= -3) {
          setDirection(1);
          return newPos;
        }
        return newPos;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [startTime, direction]);

  const shimmerWidth = 5;
  const chars = baseText.split('').map((char, i) => {
    const distance = Math.abs(i - shimmerPos);
    if (distance <= shimmerWidth) {
      const intensity = 1 - distance / shimmerWidth;
      if (intensity > 0.7) {
        return <Text key={i} color="#C59AFA">{char}</Text>;
      } else if (intensity > 0.3) {
        return <Text key={i} color="#934AF4">{char}</Text>;
      }
    }
    return <Text key={i} color="#6820C5">{char}</Text>;
  });

  const runtime = formatDuration(elapsed);
  const lastQuestion = lastQuestionTime
    ? formatDuration(Date.now() - lastQuestionTime)
    : null;

  return (
    <Box>
      <Text>{chars}</Text>
      <Text dimColor>
        {'  '}({runtime} elapsed
        {questionsAnswered > 0 && ` · ${questionsAnswered} questions answered`}
        {lastQuestion && ` · last answered ${lastQuestion} ago`})
      </Text>
    </Box>
  );
}