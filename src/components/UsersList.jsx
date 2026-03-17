import React from "react";
import UserItem from "./UserItem";

export default function UsersList({ products, onEdit, onDelete, userRole }) {
  if (!products || !products.length) {
    return <div className="empty">Товаров пока нет</div>;
  }

  return (
    <div className="list">
      {products.map((product) => (
        <UserItem 
          key={product.id} 
          product={product} 
          onEdit={onEdit} 
          onDelete={onDelete}
          userRole={userRole}
        />
      ))}
    </div>
  );
}
