import React from "react";

export default function UserItem({ product, onEdit, onDelete }) {
  const getStockClass = () => {
    if (product.stock === 0) return "productStock--out";
    if (product.stock < 5) return "productStock--low";
    return "productStock";
  };

  // Рейтинг
  const renderRating = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className="ratingStar">
          {i <= Math.round(product.rating) ? "★" : "☆"}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="productRow">
      <div className="productMain">
        {product.image && (
          <img 
            src={product.image} 
            alt={product.name} 
            className="productImage"
          />
        )}
        <div className="productInfo">
          <div className="productId">#{product.id}</div>
          <div className="productName">{product.name}</div>
          <span className="productCategory">{product.category}</span>
          <div className="productDescription">{product.description}</div>
          <div className="productDetails">
            <span className="productPrice">{product.price} ₽</span>
            <span className={getStockClass()}>
              {product.stock === 0 
                ? "Нет в наличии" 
                : `В наличии: ${product.stock} шт.`}
            </span>
            <div className="productRating">
              {renderRating()}
              <span>({product.rating.toFixed(1)})</span>
            </div>
          </div>
        </div>
      </div>
      <div className="productActions">
        <button className="btn" onClick={() => onEdit(product)}>
          Редактировать
        </button>
        <button className="btn btn--danger" onClick={() => onDelete(product.id)}>
          Удалить
        </button>
      </div>
    </div>
  );
}
