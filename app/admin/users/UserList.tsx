'use client'

export default function UserList({ users }: { users: any[] }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="text-lg font-bold text-gray-800">Users</h3>
      </div>
      <div className="divide-y">
        {users.map((user) => (
          <div key={user.id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{user.full_name}</h4>
                <p className="text-sm text-gray-600">{user.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {user.role}
                  </span>
                  {user.is_active ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
