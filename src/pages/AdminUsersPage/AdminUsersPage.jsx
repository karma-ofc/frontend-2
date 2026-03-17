import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";
import { Link } from "react-router-dom";

export default function AdminUsersPage() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const updatedUser = await api.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: updatedUser.role } : u))
      );
    } catch (err) {
      alert("Ошибка при обновлении роли");
    }
  };

  const handleDeleteUser = async (userId) => {
    const ok = window.confirm("Вы уверены, что хотите заблокировать (удалить) пользователя?");
    if (!ok) return;

    try {
      await api.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      alert("Ошибка при блокировке пользователя");
    }
  };

  if (loading) return <div className="page"><div className="container"><div className="empty">Загрузка...</div></div></div>;
  if (error) return <div className="page"><div className="container"><div className="empty">Ошибка: {error}</div></div></div>;

  return (
    <div className="page">
      <header className="header">
        <div className="header__inner">
          <div className="brand">Магазин одежды - Управление Пользователями</div>
          <div className="header__right">
            {user && (
              <span className="header__user">
                {user.first_name} {user.last_name} ({user.role})
              </span>
            )}
            <Link to="/" className="btn" style={{ marginRight: '10px' }}>Каталог</Link>
            <button className="btn btn--logout" onClick={logout}>
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <h1 className="title">Список пользователей</h1>
          <div className="list">
            {users.map((u) => (
              <div key={u.id} className="productRow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontWeight: 'bold' }}>{u.first_name} {u.last_name}</div>
                  <div style={{ color: '#6b7280', fontSize: '14px' }}>Email: {u.email}</div>
                  <div style={{ color: '#6b7280', fontSize: '14px' }}>Текущая роль: {u.role}</div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    style={{ padding: '5px', borderRadius: '4px' }}
                    disabled={u.id === user.id}
                  >
                    <option value="User">User</option>
                    <option value="Seller">Seller</option>
                    <option value="Admin">Admin</option>
                  </select>

                  <button
                    className="btn btn--danger"
                    onClick={() => handleDeleteUser(u.id)}
                    disabled={u.id === user.id}
                  >
                    Заблокировать
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
