import { ComponentType, memo } from 'react';

export function memoWithProps<T>(
  Component: ComponentType<T>,
  propsAreEqual?: (prevProps: Readonly<T>, nextProps: Readonly<T>) => boolean
) {
  return memo(Component, propsAreEqual);
}