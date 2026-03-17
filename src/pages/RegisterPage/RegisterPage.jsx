import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../LoginPage/LoginPage.scss';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (form.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    setLoading(true);
    try {
      await register(form.email, form.first_name, form.last_name, form.password);
      navigate('/');
    } catch (err) {
      const msg =
        err?.response?.data?.error || err?.message || 'Ошибка регистрации';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="register-header">
          <div className="register-icon">👕</div>
          <h1 className="auth-card__title">Регистрация</h1>
          <p className="auth-card__subtitle">Магазин Одежды</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <label className="auth-label">
              Имя
              <input
                className="auth-input"
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                required
                placeholder="Ваше имя"
                autoComplete="given-name"
              />
            </label>

            <label className="auth-label">
              Фамилия
              <input
                className="auth-input"
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                required
                placeholder="Ваша фамилия"
                autoComplete="family-name"
              />
            </label>
          </div>

          <label className="auth-label">
            Email
            <input
              className="auth-input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
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
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Не менее 6 символов"
              autoComplete="new-password"
            />
          </label>

          <label className="auth-label">
            Подтвердите пароль
            <input
              className="auth-input"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Повторите пароль"
              autoComplete="new-password"
            />
          </label>

          <button className="auth-btn register-btn" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Регистрация...
              </>
            ) : (
              'Зарегистрироваться'
            )}
          </button>
        </form>

        <div className="register-benefits">
          <p>При регистрации вы получаете:</p>
          <ul>
            <li>✓ Доступ к личному кабинету</li>
            <li>✓ Возможность оформлять заказы</li>
            <li>✓ Скидка 5% на первый заказ</li>
          </ul>
        </div>

        <p className="auth-footer">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="auth-link">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
