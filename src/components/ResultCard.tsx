export default function ResultCard({
  checkInTime,
  photoUrl,
}: {
  checkInTime: string
  photoUrl?: string
}) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-sm text-gray-500">Absensi Terekam</p>
      <p className="mt-1 text-2xl font-semibold">Check-in</p>
      <p className="mt-1 text-sm text-gray-600">{new Date(checkInTime).toLocaleString()}</p>
      {photoUrl ? (
        <img src={photoUrl} alt="Foto bukti" className="mt-3 h-24 w-24 object-cover rounded border" />
      ) : null}
    </div>
  )
}

