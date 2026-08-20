import React from 'react';
import { Fraction } from '../types/game';

interface FractionViewProps {
  fraction: Fraction;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  textColor?: string;
  className?: string;
}

export const FractionView: React.FC<FractionViewProps> = ({
  fraction,
  size = 'md',
  textColor = 'text-white',
  className = '',
}) => {
  const { whole, numerator, denominator } = fraction;

  // 전체 크기 스타일 맵
  const sizeMap = {
    sm: {
      whole: 'text-base font-bold mr-1',
      numDen: 'text-xs font-semibold',
      gap: 'my-[1px]',
      minW: 'min-w-[14px]',
    },
    md: {
      whole: 'text-xl font-bold mr-1.5',
      numDen: 'text-sm font-bold',
      gap: 'my-[1.5px]',
      minW: 'min-w-[18px]',
    },
    lg: {
      whole: 'text-2xl font-black mr-2',
      numDen: 'text-base font-bold',
      gap: 'my-[2px]',
      minW: 'min-w-[22px]',
    },
    xl: {
      whole: 'text-3xl font-black mr-2.5',
      numDen: 'text-lg font-extrabold',
      gap: 'my-[2px]',
      minW: 'min-w-[28px]',
    },
    '2xl': {
      whole: 'text-4xl md:text-5xl font-black mr-3',
      numDen: 'text-xl md:text-2xl font-black',
      gap: 'my-[3px]',
      minW: 'min-w-[34px]',
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // 자연수만 있는 경우 (분자가 0이거나 분모로 나누어 떨어짐)
  if (numerator === 0 && whole > 0) {
    return (
      <div className={`inline-flex items-center font-black ${textColor} ${currentSize.whole} ${className}`}>
        {whole}
      </div>
    );
  }

  // 분자만 있는 경우 (분모가 0이거나 없을 때 안전 처리)
  if (denominator === 0) {
    return <span className={textColor}>0</span>;
  }

  return (
    <div className={`inline-flex items-center align-middle select-none ${textColor} ${className}`}>
      {whole > 0 && (
        <span className={`${currentSize.whole} leading-none drop-shadow-sm`}>
          {whole}
        </span>
      )}
      <div className={`inline-flex flex-col items-center justify-center text-center ${currentSize.minW} leading-none`}>
        <span className={`${currentSize.numDen} px-0.5 tracking-tight`}>
          {numerator}
        </span>
        <div className={`w-full border-t-2 border-current rounded-full ${currentSize.gap} opacity-90`} />
        <span className={`${currentSize.numDen} px-0.5 tracking-tight`}>
          {denominator}
        </span>
      </div>
    </div>
  );
};
