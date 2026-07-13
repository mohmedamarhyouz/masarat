export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? 'brand--compact' : ''}`}>
      <div className="brand__mark" aria-hidden="true">
        <span className="brand__route" />
        <span className="brand__dot" />
      </div>
      {!compact && (
        <div>
          <strong>مسارات</strong>
          <span>MASARAT</span>
        </div>
      )}
    </div>
  )
}
