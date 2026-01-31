import React from 'react';

export function BackgroundGrid({ fixed = false }: { fixed?: boolean }) {
  return (
    <div className={`${fixed ? 'fixed' : 'absolute'} inset-0 z-0 pointer-events-none overflow-hidden`}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]" />
      <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] bg-blue-500/10 opacity-30 blur-[100px]" />
    </div>
  );
}
