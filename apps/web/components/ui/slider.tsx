'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'defaultValue' | 'onChange'> {
  value?: number[];
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
  name?: string;
}

const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue = [0],
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      orientation = 'horizontal',
      onValueChange,
      onValueCommit,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValues, setInternalValues] = React.useState<number[]>(
      controlledValue ?? defaultValue
    );

    const values = isControlled ? controlledValue : internalValues;

    const trackRef = React.useRef<HTMLSpanElement | null>(null);
    const activeThumbIndexRef = React.useRef<number | null>(null);

    // Keep internal values synced with controlled value if changed
    React.useEffect(() => {
      if (isControlled) {
        setInternalValues(controlledValue);
      }
    }, [isControlled, controlledValue]);

    const clamp = (val: number) => Math.min(Math.max(val, min), max);

    const roundToStep = (val: number) => {
      const steps = Math.round((val - min) / step);
      const stepped = min + steps * step;
      // Precision handling for float steps
      const precision = step.toString().split('.')[1]?.length || 0;
      return clamp(Number(stepped.toFixed(precision)));
    };

    const getValueFromPointer = (clientX: number, clientY: number) => {
      if (!trackRef.current) return min;
      const rect = trackRef.current.getBoundingClientRect();
      let percentage = 0;

      if (orientation === 'horizontal') {
        percentage = (clientX - rect.left) / rect.width;
      } else {
        percentage = 1 - (clientY - rect.top) / rect.height;
      }

      const clampedPercentage = Math.max(0, Math.min(1, percentage));
      const rawValue = min + clampedPercentage * (max - min);
      return roundToStep(rawValue);
    };

    const updateValue = (index: number, newValue: number) => {
      const nextValues = [...values];
      nextValues[index] = newValue;

      // Maintain sort order for multi-thumb ranges
      if (nextValues.length === 2) {
        if (index === 0 && nextValues[0] > nextValues[1]) {
          nextValues[0] = nextValues[1];
        } else if (index === 1 && nextValues[1] < nextValues[0]) {
          nextValues[1] = nextValues[0];
        }
      }

      if (!isControlled) {
        setInternalValues(nextValues);
      }
      onValueChange?.(nextValues);
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLSpanElement>) => {
      if (disabled) return;
      event.preventDefault();

      const target = event.target as HTMLElement;
      const thumbIndex = target.dataset.thumbIndex
        ? parseInt(target.dataset.thumbIndex, 10)
        : null;

      const clickValue = getValueFromPointer(event.clientX, event.clientY);

      let closestIndex = 0;
      if (thumbIndex !== null) {
        closestIndex = thumbIndex;
      } else if (values.length > 1) {
        let minDiff = Infinity;
        values.forEach((v, i) => {
          const diff = Math.abs(v - clickValue);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = i;
          }
        });
      }

      activeThumbIndexRef.current = closestIndex;
      updateValue(closestIndex, clickValue);

      const handlePointerMove = (e: PointerEvent) => {
        if (activeThumbIndexRef.current === null) return;
        const val = getValueFromPointer(e.clientX, e.clientY);
        updateValue(activeThumbIndexRef.current, val);
      };

      const handlePointerUp = () => {
        if (activeThumbIndexRef.current !== null) {
          onValueCommit?.(values);
        }
        activeThumbIndexRef.current = null;
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (disabled) return;

      let delta = 0;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          delta = step;
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          delta = -step;
          break;
        case 'PageUp':
          delta = step * 10;
          break;
        case 'PageDown':
          delta = -step * 10;
          break;
        case 'Home':
          updateValue(index, min);
          e.preventDefault();
          return;
        case 'End':
          updateValue(index, max);
          e.preventDefault();
          return;
        default:
          return;
      }

      e.preventDefault();
      const currentVal = values[index] ?? min;
      const nextVal = clamp(currentVal + delta);
      updateValue(index, nextVal);
      onValueCommit?.(values);
    };

    // Calculate percent positions for range fill
    const getPercent = (v: number) => ((v - min) / (max - min)) * 100;
    const isRange = values.length >= 2;
    const rangeLeft = isRange ? getPercent(Math.min(values[0], values[1])) : 0;
    const rangeRight = isRange
      ? 100 - getPercent(Math.max(values[0], values[1]))
      : 100 - getPercent(values[0] ?? 0);

    return (
      <span
        ref={ref}
        onPointerDown={handlePointerDown}
        className={cn(
          'relative flex touch-none select-none items-center',
          orientation === 'horizontal' ? 'w-full h-5' : 'h-full w-5 flex-col',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        <span
          ref={trackRef}
          className={cn(
            'relative grow overflow-hidden rounded-full bg-secondary',
            orientation === 'horizontal' ? 'h-2 w-full' : 'w-2 h-full'
          )}
        >
          <span
            className="absolute bg-primary rounded-full transition-all duration-75 motion-reduce:transition-none"
            style={
              orientation === 'horizontal'
                ? { left: `${rangeLeft}%`, right: `${rangeRight}%`, top: 0, bottom: 0 }
                : { bottom: `${rangeLeft}%`, top: `${rangeRight}%`, left: 0, right: 0 }
            }
          />
        </span>

        {values.map((val, idx) => {
          const percent = getPercent(val);
          return (
            <span
              key={idx}
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={val}
              aria-orientation={orientation}
              aria-disabled={disabled}
              data-thumb-index={idx}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className={cn(
                'absolute block h-5 w-5 rounded-full border-2 border-primary bg-background shadow-md ring-offset-background transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:scale-110 active:scale-95 disabled:pointer-events-none motion-reduce:transform-none motion-reduce:transition-none cursor-grab active:cursor-grabbing -translate-x-1/2',
                orientation === 'horizontal' ? '-translate-y-1/2 top-1/2' : '-translate-x-1/2 left-1/2 translate-y-1/2'
              )}
              style={
                orientation === 'horizontal'
                  ? { left: `${percent}%` }
                  : { bottom: `${percent}%` }
              }
            />
          );
        })}
      </span>
    );
  }
);
Slider.displayName = 'Slider';

export { Slider };
