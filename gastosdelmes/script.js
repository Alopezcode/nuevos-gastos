document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("movimientoForm");
  const tipo = document.getElementById("tipo");
  const monto = document.getElementById("monto");
  const categoria = document.getElementById("categoria");
  const descripcion = document.getElementById("descripcion");
  const fecha = document.getElementById("fecha");
  const tabla = document.getElementById("tablaMovimientos");
  const ingresosEl = document.getElementById("totalIngresos");
  const gastosEl = document.getElementById("totalGastos");
  const balanceEl = document.getElementById("balance");

  let movimientos = [];

  // Función con parámetros
  function crearMovimiento(tipo, monto, categoria, descripcion, fecha) {
    return { id: Date.now(), tipo, monto: parseFloat(monto), categoria, descripcion, fecha };
  }

  // Segunda función con parámetros
  function calcularTotales(movimientos) {
    let ingresos = 0, gastos = 0;
    for (const m of movimientos) {
      if (m.tipo === "ingreso") ingresos += m.monto;
      else gastos += m.monto;
    }
    return { ingresos, gastos, balance: ingresos - gastos };
  }

  function renderTabla(movs) {
    tabla.innerHTML = "";
    movs.forEach(m => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${m.fecha}</td>
        <td>${m.tipo}</td>
        <td>${m.categoria}</td>
        <td>${m.descripcion}</td>
        <td>$${m.monto}</td>
        <td><button onclick="eliminarMovimiento(${m.id})">Eliminar</button></td>
      `;
      tabla.appendChild(fila);
    });
  }

  function actualizarResumen() {
    const { ingresos, gastos, balance } = calcularTotales(movimientos);
    ingresosEl.textContent = ingresos.toFixed(2);
    gastosEl.textContent = gastos.toFixed(2);
    balanceEl.textContent = balance.toFixed(2);
  }

  // Función de orden superior: filter
  function eliminarMovimiento(id) {
    movimientos = movimientos.filter(m => m.id !== id);
    renderTabla(movimientos);
    actualizarResumen();
  }
  window.eliminarMovimiento = eliminarMovimiento;

  // Evento
  form.addEventListener("submit", e => {
    e.preventDefault();
    try {
      if (!tipo.value || !monto.value || !categoria.value || !fecha.value) {
        Swal.fire("Error", "Todos los campos son obligatorios", "error");
        return;
      }
      const movimiento = crearMovimiento(tipo.value, monto.value, categoria.value, descripcion.value, fecha.value);
      movimientos.push(movimiento);
      renderTabla(movimientos);
      actualizarResumen();
      Swal.fire("Éxito", "Movimiento agregado", "success");
      form.reset();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Algo salió mal", "error");
    } finally {
      console.log("Intento de agregar movimiento finalizado.");
    }
  });

  // Cargar datos simulados desde JSON (data.js)
  fetch("data.js")
    .then(res => res.json())
    .then(data => {
      movimientos = [...movimientos, ...data];
      renderTabla(movimientos);
      actualizarResumen();
    })
    .catch(error => {
      console.error("Error al cargar datos:", error);
    });
});
