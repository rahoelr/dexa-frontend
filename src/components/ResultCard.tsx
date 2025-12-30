export default function ResultCard({
  checkInTime,
  checkOutTime,
  photoUrl,
  onCheckout,
  canCheckout,
}: {
  checkInTime: string
  checkOutTime?: string
  photoUrl?: string
  onCheckout?: () => void
  canCheckout?: boolean
}) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-sm text-gray-500">Absensi Terekam</p>
      <p className="mt-1 text-2xl font-semibold">Check-in</p>
      <p className="mt-1 text-sm text-gray-600">{new Date(checkInTime).toLocaleString()}</p>
      {checkOutTime ? (
        <>
          <p className="mt-3 text-2xl font-semibold">Check-out</p>
          <p className="mt-1 text-sm text-gray-600">{new Date(checkOutTime).toLocaleString()}</p>
        </>
      ) : null}
      {!checkOutTime && onCheckout ? (
        <div className="mt-3">
          <button
            onClick={onCheckout}
            disabled={canCheckout === false}
            className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Check-Out
          </button>
        </div>
      ) : null}
      {photoUrl ? (
        <img src={photoUrl} alt="Foto bukti" className="mt-3 h-24 w-24 object-cover rounded border" />
      ) : null}
    </div>
  )
}
