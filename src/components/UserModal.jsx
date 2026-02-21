import React, { useEffect, useState } from "react";

export default function UserModal({ 
  open, 
  mode, 
  initialProduct, 
  onClose, 
  onSubmit,
  categories 
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [rating, setRating] = useState("5");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!open) return;
    
    setName(initialProduct?.name ?? "");
    setCategory(initialProduct?.category ?? categories?.[0] ?? "");
    setDescription(initialProduct?.description ?? "");
    setPrice(initialProduct?.price != null ? String(initialProduct.price) : "");
    setStock(initialProduct?.stock != null ? String(initialProduct.stock) : "");
    setRating(initialProduct?.rating != null ? String(initialProduct.rating) : "5");
    setImage(initialProduct?.image ?? "");
  }, [open, initialProduct, categories]);

  if (!open) return null;

  const title = mode === "edit" ? "Редактирование товара" : "Создание товара";

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const trimmedImage = image.trim();
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);
    const parsedRating = Number(rating);

    if (!trimmedName) {
      alert("Введите название товара");
      return;
    }

    if (!category) {
      alert("Выберите категорию");
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      alert("Введите корректную цену");
      return;
    }

    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      alert("Введите корректное количество на складе");
      return;
    }

    if (!Number.isFinite(parsedRating) || parsedRating < 0 || parsedRating > 5) {
      alert("Введите корректный рейтинг (0-5)");
      return;
    }

    onSubmit({
      id: initialProduct?.id,
      name: trimmedName,
      category,
      description: trimmedDescription,
      price: parsedPrice,
      stock: parsedStock,
      rating: parsedRating,
      image: trimmedImage,
    });
  };

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <div 
        className="modal" 
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog" 
        aria-modal="true"
      >
        <div className="modal__header">
          <div className="modal__title">{title}</div>
          <button className="iconBtn" onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <label className="label">
            Название товара
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, Ноутбук"
              autoFocus
            />
          </label>
          
          <label className="label">
            Категория
            <select
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories && categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
          
          <label className="label">
            Описание
            <textarea
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание товара..."
            />
          </label>
          
          <label className="label">
            Цена (₽)
            <input
              className="input"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Например, 999"
            />
          </label>
          
          <label className="label">
            Количество на складе
            <input
              className="input"
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Например, 10"
            />
          </label>
          
          <label className="label">
            Рейтинг (0-5)
            <input
              className="input"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="Например, 4.5"
            />
          </label>
          
          <label className="label">
            URL изображения
            <input
              className="input"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </label>
          
          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary">
              {mode === "edit" ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
