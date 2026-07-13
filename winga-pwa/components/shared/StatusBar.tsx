export default function StatusBar() {
  return (
    <div className="flex justify-between items-center px-5 pt-3 pb-1">
      <span className="text-xs font-bold text-text-dark">9:41</span>
      <div className="flex items-center gap-1">
        <span className="text-xs font-semibold text-text-dark">●●●●</span>
        <span className="text-xs font-semibold text-text-dark ml-1">🔋</span>
      </div>
    </div>
  )
}
