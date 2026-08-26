import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  color = 'moss',
  onClick
}) => {
  const accentColor = color === 'clay' || color === 'gold' 
    ? 'text-[#C18C5D] bg-[#C18C5D]/10 group-hover:bg-[#C18C5D]' 
    : 'text-[#5D7052] bg-[#5D7052]/10 group-hover:bg-[#5D7052]';

  return (
    <div
      onClick={onClick}
      className={`group relative p-6 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF]/80 shadow-soft transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:-translate-y-1.5 hover:shadow-float hover:border-[#5D7052]/40' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold text-[#78786C] tracking-wider uppercase">
            {title}
          </p>
          <h4 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#2C2C24] font-serif">
            {value}
          </h4>
        </div>
        {Icon && (
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:text-[#FFFFFF] group-hover:scale-105 ${accentColor}`}>
            <Icon className="w-6 h-6 stroke-[2.2]" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-[#DED8CF]/30">
        <p className="text-[#78786C] text-[11px] truncate max-w-[180px] font-medium">
          {subtitle}
        </p>
        {trend && (
          <div className={`flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[11px] ${
            trendPositive 
              ? 'bg-[#5D7052]/10 text-[#5D7052]' 
              : 'bg-[#A85448]/10 text-[#A85448]'
          }`}>
            {trendPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
};

