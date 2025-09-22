import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const API_BASE = "http://localhost:3001/api/products";

const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre: "", descripcion: "", precio: "", stock: "" });

  const fetchProducts = () => {
    setLoading(true);
    fetch(`${API_BASE}/list`)
      .then((res) => res.json())
      .then((data) => setProducts(data.productos || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editing ? "PUT" : "POST";
    const url = editing ? `${API_BASE}/update-price` : `${API_BASE}/create`;

    const payload = editing
      ? { id_producto: editing, precio: form.precio }
      : form; // ahora incluye descripcion

    try {
      const confirm = await Swal.fire({
        title: editing ? "¿Actualizar precio?" : "¿Crear producto?",
        text: editing
          ? `Nuevo precio: $${form.precio}`
          : `Producto: ${form.nombre} - Precio: $${form.precio}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: editing ? "Actualizar" : "Crear",
        cancelButtonText: "Cancelar",
      });

      if (!confirm.isConfirmed) return;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error en la petición");

      await res.json();

      Swal.fire({
        title: editing ? "Precio actualizado" : "Producto creado",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setForm({ nombre: "", descripcion: "", precio: "", stock: "" });
      setEditing(null);
      fetchProducts();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleEdit = (product) => {
    setEditing(product.id_producto);
    setForm({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      stock: product.stock,
    });
  };

const handleDelete = async (id, nombre) => {
  const confirm = await Swal.fire({
    title: "¿Eliminar producto?",
    text: `Se eliminará "${nombre}"`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (!confirm.isConfirmed) return;

  try {
    const res = await fetch(`${API_BASE}/delete/${id}`, { method: "DELETE" }); 
    if (!res.ok) throw new Error("Error al eliminar producto");

    Swal.fire("Eliminado", "El producto ha sido eliminado.", "success");
    fetchProducts();
  } catch (err) {
    Swal.fire("Error", err.message, "error");
  }
};


  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="products-manager">
      <h2>Gestión de Productos</h2>

      <form onSubmit={handleSubmit} className="product-form">
        {!editing && (
          <>
            <input
              type="text"
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Stock inicial"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
            />
          </>
        )}
        <input
          type="number"
          placeholder="Precio"
          value={form.precio}
          onChange={(e) => setForm({ ...form, precio: e.target.value })}
          required
        />
        <button type="submit">
          {editing ? "Actualizar precio" : "Crear producto"}
        </button>
        {editing && (
          <button
            type="button"
            className="btn-cancel"
            onClick={() => setEditing(null)}
          >
            Cancelar
          </button>
        )}
      </form>

      <table className="cash-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id_producto}>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>${p.precio}</td>
              <td>{p.stock}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Editar precio</button>
                <button onClick={() => handleDelete(p.id_producto, p.nombre)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsManager;
