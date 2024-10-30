import React from "react";

const Counter = (props: CounterProps) => {
  const { value, minValue, maxValue, onChange, incrementBy = 1, title } = props;
  return (
    <div className="flex items-center justify-between gap-1">
      <p>{title}</p>
      <div className="flex items-center">
        <button
          type="button"
          className="size-10 leading-10 text-gray-600 transition hover:opacity-75"
          onClick={() => {
            if (value > minValue) {
              onChange(value - incrementBy);
            }
          }}
        >
          -
        </button>

        <span className="size-10 content-center text-center bg-white rounded border-gray-200">
          {value}
        </span>

        <button
          type="button"
          className="size-10 text-2xl leading-10 text-gray-600 transition hover:opacity-75"
          onClick={() => {
            if (value < maxValue) {
              onChange(value + incrementBy);
            }
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

interface CounterProps {
  value: number;
  minValue: number;
  maxValue: number;
  incrementBy?: number;
  onChange: (d: number) => void;
  title: string;
}

export default Counter;
