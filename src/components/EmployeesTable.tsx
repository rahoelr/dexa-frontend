import type { Employee } from "../types"

export default function EmployeesTable({
  employees,
  onEdit,
  onDelete,
}: {
  employees: Employee[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="rounded-lg border bg-white">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2">Nama</th>
            <th className="px-4 py-2">NIP</th>
            <th className="px-4 py-2">Departemen</th>
            <th className="px-4 py-2">Jabatan</th>
            <th className="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.id} className="border-t">
              <td className="px-4 py-2">{e.name}</td>
              <td className="px-4 py-2">{e.nip}</td>
              <td className="px-4 py-2">{e.department}</td>
              <td className="px-4 py-2">{e.position || "-"}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                    onClick={() => onEdit(e.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700"
                    onClick={() => onDelete(e.id)}
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

