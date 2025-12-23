const Loading = ({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-dark-400 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-16 h-16 spinner mx-auto mb-4"></div>
        <p className="text-white/60 animate-pulse">{text}</p>
      </div>
    </div>
  );
};

export default Loading;

