export default function ImpactStatsCard({ filed, resolved, message, header }) {
  return (
    <div className="bg-linear-to-br from-[#2B4AA0] to-[#1a2d6b] text-white rounded-lg p-6 shadow-lg">
      <h3 className="text-lg mb-4">{header || "Impact Stats"}</h3>
      <div className="space-y-4">
        <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <div className="text-4xl mb-1">{filed}</div>
          <div className="text-sm opacity-90">Reports Filed</div>
        </div>
        <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <div className="text-4xl mb-1">{resolved}</div>
          <div className="text-sm opacity-90">Resolved</div>
        </div>
        <div className="text-sm opacity-90 border-t border-white/20 pt-4 text-center">
          {message}
        </div>
      </div>
    </div>
  );
}
