import React, { useMemo, useState, useEffect } from "react";
import "./UsersPage.scss";
import UsersList from "../../components/UsersList";
import UserModal from "../../components/UserModal";
import api from "../../api";

// Товары
const INITIAL_PRODUCTS = [
  { id: 1, name: "Куртка зимняя мужская", category: "Верхняя одежда", description: "Утепленная, водонепроницаемая, размеры M-XXL", price: 12990, stock: 15, rating: 4.5, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200&h=200&fit=crop" },
  { id: 2, name: "Кроссовки Nike Air Max", category: "Обувь", description: "Беговые, размеры 40-45, амортизация Air", price: 14990, stock: 23, rating: 4.7, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" },
  { id: 3, name: "Джинсы классические Levi's", category: "Одежда", description: "Прямой крой, синие, размеры 28-36", price: 8990, stock: 30, rating: 4.6, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop" },
  { id: 4, name: "Ботинки кожаные Dr. Martens", category: "Обувь", description: "Стальной носок, черные, размеры 39-44", price: 18990, stock: 12, rating: 4.8, image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=200&h=200&fit=crop" },
  { id: 5, name: "Свитшот Nike спортивный", category: "Спортивная одежда", description: "Хлопок, капюшон, серый, размеры S-XXL", price: 6990, stock: 25, rating: 4.4, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop" },
  { id: 6, name: "Сумка через плечо Hugo Boss", category: "Сумки", description: "Кожа, черная, вместимость 10л", price: 15990, stock: 8, rating: 4.5, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop" },
  { id: 7, name: "Пальто женское Zara", category: "Верхняя одежда", description: "Шерстяное, бежевое, размеры XS-L", price: 19990, stock: 7, rating: 4.6, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200&h=200&fit=crop" },
  { id: 8, name: "Кеды Converse Classic", category: "Обувь", description: "Тканевые, белые, размеры 35-42", price: 5990, stock: 35, rating: 4.7, image: "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=200&h=200&fit=crop" },
  { id: 9, name: "Рюкзак Herschel Supply", category: "Сумки", description: "30л, городской, синий", price: 7990, stock: 18, rating: 4.5, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop" },
  { id: 10, name: "Футзалки Adidas Predator", category: "Обувь", description: "Для зала, размеры 38-44, мягкая подошва", price: 11990, stock: 14, rating: 4.6, image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=200&h=200&fit=crop" },
  { id: 11, name: "Штаны спортивные Nike Tech", category: "Спортивная одежда", description: "Ветрозащитные, черные, размеры S-XXL", price: 8990, stock: 22, rating: 4.4, image: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=200&h=200&fit=crop" },
  { id: 12, name: "Шарф вязаный Burberry", category: "Аксессуары", description: "Шерсть, кашемировый, бежевый в клетку", price: 24990, stock: 6, rating: 4.9, image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=200&h=200&fit=crop" },
];

// Список категорий
const CATEGORIES = [
  "Все категории",
  "Одежда",
  "Обувь",
  "Верхняя одежда",
  "Спортивная одежда",
  "Сумки",
  "Аксессуары"
];

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все категории");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (apiError) {
        // Если API недоступен, использовать начальные данные
        console.log("Using initial products data");
        setProducts(INITIAL_PRODUCTS);
      }
    } catch (err) {
      setError(err.message);
      // Резервное копирование
      setProducts(INITIAL_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  const nextId = useMemo(() => {
    const maxId = products.reduce((m, p) => Math.max(m, p.id), 0);
    return maxId + 1;
  }, [products]);

  // Фильтр товаров
  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Фильтр по категории
    if (selectedCategory !== "Все категории") {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    // Фильтр по поисковому запросу
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [products, selectedCategory, searchQuery]);

  // Статистика
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const avgRating = products.length > 0 
      ? products.reduce((sum, p) => sum + p.rating, 0) / products.length 
      : 0;
    return { totalProducts, totalStock, avgRating };
  }, [products]);

  const openCreate = () => {
    setModalMode("create");
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setModalMode("edit");
    setEditingProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Удалить товар?");
    if (!ok) return;
    
    try {
      // Попытка удалить через API
      try {
        await api.deleteProduct(id);
      } catch (apiError) {
        console.log("API not available, deleting locally");
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Ошибка при удалении товара");
    }
  };

  const handleSubmitModal = async (payload) => {
    try {
      if (modalMode === "create") {
        const newProduct = { 
          id: nextId, 
          name: payload.name,
          category: payload.category,
          description: payload.description,
          price: payload.price,
          stock: payload.stock,
          rating: payload.rating,
          image: payload.image
        };
        
        try {
          await api.createProduct(newProduct);
        } catch (apiError) {
          console.log("API not available, saving locally");
        }
        
        setProducts((prev) => [...prev, newProduct]);
      } else {
        const updatedProduct = {
          id: payload.id,
          name: payload.name,
          category: payload.category,
          description: payload.description,
          price: payload.price,
          stock: payload.stock,
          rating: payload.rating,
          image: payload.image
        };
        
        try {
          await api.updateProduct(payload.id, updatedProduct);
        } catch (apiError) {
          console.log("API not available, updating locally");
        }
        
        setProducts((prev) =>
          prev.map((p) => (p.id === payload.id ? { ...p, ...updatedProduct } : p))
        );
      }
      closeModal();
    } catch (err) {
      alert("Ошибка при сохранении товара");
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="page">
        <header className="header">
          <div className="header__inner">
            <div className="brand">Магазин одежды и обуви</div>
            <div className="header__right">React</div>
          </div>
        </header>
        <main className="main">
          <div className="container">
            <div className="empty">Загрузка...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="header">
        <div className="header__inner">
          <div className="brand">Магазин одежды и обуви</div>
          <div className="header__right">React</div>
        </div>
      </header>
      
      <main className="main">
        <div className="container">
          <div className="toolbar">
            <h1 className="title">Каталог товаров</h1>
            <button className="btn btn--primary" onClick={openCreate}>
              + Добавить товар
            </button>
          </div>

          {/* Stats */}
          <div className="stats">
            <div className="stat">
              Всего товаров:<span className="statValue">{stats.totalProducts}</span>
            </div>
            <div className="stat">
              На складе:<span className="statValue">{stats.totalStock} шт.</span>
            </div>
            <div className="stat">
              Средний рейтинг:<span className="statValue">{stats.avgRating.toFixed(1)} ★</span>
            </div>
          </div>

          {/* Search */}
          <div className="search">
            <input
              type="text"
              className="searchInput"
              placeholder="Поиск по названию или описанию..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          {/* Category Filter */}
          <div className="filter">
            <span className="filterLabel">Категория:</span>
            <select
              className="filterSelect"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <UsersList 
            products={filteredProducts} 
            onEdit={openEdit} 
            onDelete={handleDelete} 
          />
        </div>
      </main>
      
      <footer className="footer">
        <div className="footer__inner">
          © {new Date().getFullYear()} Магазин одежды и обуви
        </div>
      </footer>

      <UserModal
        open={modalOpen}
        mode={modalMode}
        initialProduct={editingProduct}
        onClose={closeModal}
        onSubmit={handleSubmitModal}
        categories={CATEGORIES.filter(c => c !== "Все категории")}
      />
    </div>
  );
}
