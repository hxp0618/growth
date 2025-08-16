import React, { memo } from 'react';
import { SymbolView, SymbolViewProps } from 'expo-symbols';

interface IconSymbolProps extends Omit<SymbolViewProps, 'name'> {
  size?: number;
  color?: string;
  name: string;
}

export const IconSymbol = memo(function IconSymbol({
  size = 24,
  color,
  name,
  weight = "regular",
  scale = "medium",
  ...props
}: IconSymbolProps) {
  return (
    <SymbolView
      name={name as any}
      weight={weight}
      scale={scale}
      size={size}
      tintColor={color}
      {...props}
    />
  );
});