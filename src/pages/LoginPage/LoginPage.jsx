import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.scss';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      const msg =
        err?.response?.data?.error || err?.message || 'Ошибка входа';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Вход</h1>
        <p className="auth-card__subtitle">Магазин Одежды</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Email
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@mail.com"
              autoComplete="email"
            />
          </label>

          <label className="auth-label">
            Пароль
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Введите пароль"
              autoComplete="current-password"
            />
          </label>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <p className="auth-footer">
          Нет аккаунта?{' '}
          <Link to="/register" className="auth-link">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
