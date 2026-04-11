import React from 'react';

const LoadingPage = ({ message = "Synchronizing Security Ledger..." }) => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Branded Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      
      <div className="z-10 flex flex-col items-center gap-8">
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="w-20 h-20 rounded-full border-t-2 border-r-2 border-primary/20 animate-spin" />
          {/* Inner logo/pulsing element */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-surface border border-border rounded-xl flex items-center justify-center shadow-gold-glow animate-pulse">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-text-primary font-bold tracking-[0.2em] uppercase text-xs">Altata Légal</h3>
          <p className="text-[10px] text-text-muted mt-2 font-medium tracking-widest uppercase animate-pulse">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
