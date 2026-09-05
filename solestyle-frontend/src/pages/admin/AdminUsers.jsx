import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users");

      setUsers(response.data || []);
    } catch (error) {
      console.error("Error loading users:", error);
      setError("Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-container">
          <div className="admin-message">
            Loading users...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-container">

        <div className="admin-header">
          <div>
            <p className="admin-eyebrow">
              SOLESTYLE ADMIN
            </p>

            <h1>Users</h1>

            <p>
              View registered SoleStyle customers.
            </p>
          </div>
        </div>

        {error && (
          <div className="admin-error">
            <span>{error}</span>

            <button onClick={loadUsers}>
              Try Again
            </button>
          </div>
        )}

        <div className="admin-card">

          <div className="admin-card-header">

            <div>
              <h2>Registered Users</h2>

              <p>
                {users.length} user
                {users.length !== 1 ? "s" : ""}
              </p>
            </div>

          </div>

          {users.length === 0 ? (
            <div className="admin-empty">

              <h3>No users found</h3>

              <p>
                Registered customers will appear here.
              </p>

            </div>
          ) : (
            <div className="admin-users-table">

              <div className="admin-table-header">

                <span>#</span>
                <span>User</span>
                <span>Email</span>
                <span>Role</span>
                <span>ID</span>

              </div>

              {users.map((user, index) => (
                <div
                  className="admin-table-row"
                  key={user.id}
                >

                  <span>
                    {index + 1}
                  </span>

                  <div className="admin-user-cell">

                    <div className="admin-user-avatar">
                      {user.name
                        ? user.name
                            .charAt(0)
                            .toUpperCase()
                        : "U"}
                    </div>

                    <div>
                      <strong>
                        {user.name || "-"}
                      </strong>

                      <span>
                        {user.email || "-"}
                      </span>
                    </div>

                  </div>

                  <span>
                    {user.email || "-"}
                  </span>

                  <span
                    className={`admin-role ${
                      (user.role || "USER").toLowerCase()
                    }`}
                  >
                    {user.role || "USER"}
                  </span>

                  <span>
                    {user.id}
                  </span>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </main>
  );
}

export default AdminUsers;