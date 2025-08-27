export default function Loading() {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary"></div>
          </div>
          <h2 className="text-2xl font-bold gradient-text">Loading ReSellHub</h2>
          <p className="text-white/80">Please wait while we prepare your experience...</p>
        </div>
      </div>
    );
  }