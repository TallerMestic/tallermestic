const shelf = document.getElementById("shelf");
const search = document.getElementById("search");
const objectList = document.getElementById("objectList");
const deletePositionInput = document.getElementById("deletePosition");
const warehouseItemInput = document.getElementById("warehouseItem");
const warehouseList = document.getElementById("warehouseList");
const leftWarehouseItemInput = document.getElementById("leftWarehouseItem");
const leftWarehouseList = document.getElementById("leftWarehouseList");
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};
let warehouse = JSON.parse(localStorage.getItem("warehouse")) || [];
let leftWarehouse = JSON.parse(localStorage.getItem("leftWarehouse")) || [];

// Renderiza la estantería con las celdas y sus posiciones
function renderShelf() {
    shelf.innerHTML = ""; // Limpiar la cuadrícula antes de renderizar
    const rows = "ABCDEFGH";
    
    for (let row of rows) {
        for (let col = 1; col <= 12; col++) {
            let cellId = row + col;
            let cell = document.createElement("div");
            cell.className = "cell";
            
            // Mostrar la posición
            let positionLabel = document.createElement("span");
            positionLabel.textContent = cellId;
            cell.appendChild(positionLabel);

            // Mostrar los objetos en la celda (si existen)
            if (inventory[cellId]) {
                let itemText = document.createElement("div");
                itemText.textContent = inventory[cellId].join(", ");
                cell.appendChild(itemText);
            }
            
            // Evento de clic para agregar objetos
            cell.onclick = () => toggleItem(cellId);

            shelf.appendChild(cell);
        }
    }
}

// Agrega un objeto en la celda seleccionada
function toggleItem(cellId) {
    let item = prompt("Nombre del objeto en " + cellId);
    if (item && item.trim() !== "") {
        if (!inventory[cellId]) {
            inventory[cellId] = [];
        }
        inventory[cellId].push(item.trim());
    }
    localStorage.setItem("inventory", JSON.stringify(inventory));
    renderShelf();
    updateSearchList();
}

// Elimina todos los objetos en una posición ingresada
function deleteItemAtPosition() {
    let position = deletePositionInput.value.toUpperCase();
    if (inventory[position]) {
        delete inventory[position]; // Elimina la entrada en el objeto
        localStorage.setItem("inventory", JSON.stringify(inventory));
        renderShelf();
        updateSearchList();
        alert(`Se eliminaron los objetos en ${position}`);
    } else {
        alert(`No hay objetos en ${position}`);
    }
    deletePositionInput.value = ""; // Limpia el campo de entrada
}

// Actualiza el datalist con los objetos filtrados
search.addEventListener("input", updateSearchList);

function updateSearchList() {
    objectList.innerHTML = "";
    let searchTerm = search.value.trim().toLowerCase();
    let filteredItems = Object.entries(inventory)
        .flatMap(([position, items]) => items.map(item => ({ item, position })))
        .filter(({ item }) => item.toLowerCase().includes(searchTerm));

    filteredItems.forEach(({ item }) => {
        let option = document.createElement("option");
        option.value = item;
        objectList.appendChild(option);
    });
}

// Función para buscar un objeto y resaltar la celda
function searchItem() {
    let selectedItem = search.value.trim().toLowerCase();
    document.querySelectorAll(".cell").forEach(cell => cell.classList.remove("highlight"));
    const searchResultPosition = document.getElementById("searchResultPosition");
    searchResultPosition.style.display = "none";

    if (selectedItem) {
        let positions = Object.keys(inventory).filter(key => 
            inventory[key].some(item => item.toLowerCase() === selectedItem)
        );

        if (positions.length > 0) {
            positions.forEach(position => {
                let targetCell = Array.from(shelf.children).find(cell => 
                    cell.querySelector("span").textContent === position
                );
                if (targetCell) {
                    targetCell.classList.add("highlight");
                }
            });
            searchResultPosition.textContent = `Posiciones: ${positions.join(", ")}`;
            searchResultPosition.style.display = "block";
        } else if (warehouse.includes(selectedItem)) {
            alert("El objeto está en el almacén.");
        } else if (leftWarehouse.includes(selectedItem)) {
            alert("El objeto está en el almacén izquierdo.");
        } else {
            alert("Objeto no encontrado.");
        }
    }
}

// Añade un objeto al almacén
function addWarehouseItem() {
    let item = warehouseItemInput.value.trim();
    if (item && !warehouse.includes(item)) {
        warehouse.push(item);
        localStorage.setItem("warehouse", JSON.stringify(warehouse));
        renderWarehouseList();
        warehouseItemInput.value = "";
    }
}

// Añade un objeto al almacén izquierdo
function addLeftWarehouseItem() {
    let item = leftWarehouseItemInput.value.trim();
    if (item && !leftWarehouse.includes(item)) {
        leftWarehouse.push(item);
        localStorage.setItem("leftWarehouse", JSON.stringify(leftWarehouse));
        renderLeftWarehouseList();
        leftWarehouseItemInput.value = "";
    }
}

// Elimina un objeto del almacén
function deleteWarehouseItem(item) {
    if (confirm(`¿Estás seguro de que deseas eliminar "${item}" del almacén?`)) {
        warehouse = warehouse.filter(warehouseItem => warehouseItem !== item);
        localStorage.setItem("warehouse", JSON.stringify(warehouse));
        renderWarehouseList();
    }
}

// Elimina un objeto del almacén izquierdo
function deleteLeftWarehouseItem(item) {
    if (confirm(`¿Estás seguro de que deseas eliminar "${item}" del almacén izquierdo?`)) {
        leftWarehouse = leftWarehouse.filter(leftWarehouseItem => leftWarehouseItem !== item);
        localStorage.setItem("leftWarehouse", JSON.stringify(leftWarehouse));
        renderLeftWarehouseList();
    }
}

// Renderiza la lista de objetos en el almacén
function renderWarehouseList() {
    warehouseList.innerHTML = "";
    warehouse.forEach(item => {
        let listItem = document.createElement("div");
        listItem.className = "warehouse-item";
        
        let itemText = document.createElement("span");
        itemText.textContent = item;

        let deleteCross = document.createElement("span");
        deleteCross.className = "delete-cross";
        deleteCross.textContent = "✖";
        deleteCross.onclick = () => deleteWarehouseItem(item);

        listItem.appendChild(itemText);
        listItem.appendChild(deleteCross);
        warehouseList.appendChild(listItem);
    });
}

// Renderiza la lista de objetos en el almacén izquierdo
function renderLeftWarehouseList() {
    leftWarehouseList.innerHTML = "";
    leftWarehouse.forEach(item => {
        let listItem = document.createElement("div");
        listItem.className = "warehouse-item";
        
        let itemText = document.createElement("span");
        itemText.textContent = item;

        let deleteCross = document.createElement("span");
        deleteCross.className = "delete-cross";
        deleteCross.textContent = "✖";
        deleteCross.onclick = () => deleteLeftWarehouseItem(item);

        listItem.appendChild(itemText);
        listItem.appendChild(deleteCross);
        leftWarehouseList.appendChild(listItem);
    });
}

// Renderiza la estantería y la lista del almacén al cargar la página
renderShelf();
renderWarehouseList();
renderLeftWarehouseList();