import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const API_BASE = "https://backturnero-vvk6.onrender.com/api/products";

const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    costo: "",
    stock: "",
  });

  // 🔑 obtener token del localStorage
  const getToken = () => localStorage.getItem("token");

  const fetchProducts = () => {
    setLoading(true);
    const token = getToken();

    fetch(`${API_BASE}/list`, {
      headers: { Authorization: `Bearer ${token}` },
    })
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
    const token = getToken();

    const method = editing ? "PUT" : "POST";
    const url = editing ? `${API_BASE}/update-price` : `${API_BASE}/create`;

    const payload = editing
      ? {
          id_producto: editing,
          precio: form.precio ? Number(form.precio) : null,
          costo: form.costo ? Number(form.costo) : null,
        }
      : {
          nombre: form.nombre,
          descripcion: form.descripcion,
          precio: Number(form.precio),
          costo: form.costo ? Number(form.costo) : null,
          stock: form.stock ? Number(form.stock) : 0,
        };

    try {
      const confirm = await Swal.fire({
        title: editing ? "¿Actualizar producto?" : "¿Crear producto?",
        text: editing
          ? `Nuevo precio: $${form.precio}${
              form.costo ? ` | Nuevo costo: $${form.costo}` : ""
            }`
          : `Producto: ${form.nombre} - Precio: $${form.precio}${
              form.costo ? ` - Costo: $${form.costo}` : ""
            }`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: editing ? "Actualizar" : "Crear",
        cancelButtonText: "Cancelar",
      });

      if (!confirm.isConfirmed) return;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👈 token aquí
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error en la petición");
      await res.json();

      Swal.fire({
        title: editing ? "Producto actualizado" : "Producto creado",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setForm({
        nombre: "",
        descripcion: "",
        precio: "",
        costo: "",
        stock: "",
      });
      setEditing(null);
      fetchProducts();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleEdit = (product) => {
    setEditing(product.id_producto);
    setForm({
      nombre: product.nombre || "",
      descripcion: product.descripcion || "",
      precio: product.precio || "",
      costo: product.costo || "",
      stock: product.stock || "",
    });
  };

  const handleDelete = async (id, nombre) => {
    const token = getToken();

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
      const res = await fetch(`${API_BASE}/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

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
      {/* Formulario */}
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
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Stock inicial"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </>
        )}

        <input
          type="number"
          placeholder="Precio (venta)"
          value={form.precio}
          onChange={(e) => setForm({ ...form, precio: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Costo (compra)"
          value={form.costo}
          onChange={(e) => setForm({ ...form, costo: e.target.value })}
        />

        <button type="submit">
          {editing ? "Actualizar precio/costo" : "Crear producto"}
        </button>
        {editing && (
          <button
            type="button"
            className="btn-cancel"
            onClick={() => {
              setEditing(null);
              setForm({
                nombre: "",
                descripcion: "",
                precio: "",
                costo: "",
                stock: "",
              });
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* Tabla */}
      <table className="cash-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Costo</th>
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
              <td>{p.costo ? `$${p.costo}` : "-"}</td>
              <td>{p.stock}</td>
              <td>
                <button onClick={() => handleEdit(p)}>
                  Editar precio/costo
                </button>
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
