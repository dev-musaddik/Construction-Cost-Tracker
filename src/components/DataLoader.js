const DataLoader = () => {
    return (
      // The fixed, full-screen overlay uses a very light, semi-transparent
      // background with a subtle backdrop blur.
      <div className="absolute inset-0 z-50 flex items-center justify-center ">
      {/* The main container for the professional loader spinner */}
      <div className="relative flex flex-col items-center">
        {/* The single, simple spinning ring */}
        <div className="w-16 h-16 rounded-full border-4 border-t-sky-400 border-b-sky-400 border-x-transparent animate-spin"></div>
      </div>
      
      {/* A professional loading message */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-20 text-md font-light text-gray-400 tracking-wide">
        Loading...
      </div>
    </div>
    );
  };

  export default DataLoader