import type { ReactNode } from 'react';
import React, { useEffect, useRef } from 'react';

/**
 * The props type for {@link MouseMonitor}.
 *
 * @category Component Properties
 * @internal
 */
export interface MouseMonitorProps {
  /**
   * Callback triggered whenever the mouse moves not within the bounds of the
   * child component. This will keep triggering as long as the component is
   * rendered.
   */
  onMoveAway(): void;

  /**
   * X padding in pixels for the container to monitor mouse activity in.
   */
  paddingX: number;

  /**
   * Y padding in pixels for the container to monitor mouse activity in.
   */
  paddingY: number;

  /**
   * Component over which mouse activity is monitored.
   */
  children: ReactNode;
}

/**
 * A component that monitors mouse movements over a child and invisible padded area.
 *
 * @category Component
 * @internal
 */
export const MouseMonitor = ({ onMoveAway, paddingX, paddingY, children }: MouseMonitorProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const onMouseMove = (event: MouseEvent) => {
    if (!containerRef.current) return;

    const { clientX, clientY } = event;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();

    const inBoundsX = clientX > left - paddingX && clientX < left + width + paddingX;
    const inBoundsY = clientY > top - paddingY && clientY < top + height + paddingY;

    if (!(inBoundsX && inBoundsY)) {
      onMoveAway();
    }
  };

  useEffect(() => {
    // TODO: Maybe optimise or throttle?
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
};
