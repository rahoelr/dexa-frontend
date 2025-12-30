export default function CardStat({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description?: string
}) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      {description ? <p className="mt-1 text-sm text-gray-600">{description}</p> : null}
    </div>
  )
}

