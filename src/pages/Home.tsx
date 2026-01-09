import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Reduxhooks";
import { useSearchParams } from "react-router-dom";
import {
  fetchItems,
  addItem,
  updateItem,
  deleteItem,
  type Item,
  clearMessages,
} from "../features/shoppingListSlice";
import Button from "../components/Button";
import Input from "../components/Input";
import Navbar from "../components/navBAr";
import Footer from "../components/footer";

const categories = [
  "Groceries",
  "Household",
  "Electronics",
  "Clothing",
  "Health & Beauty",
];

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error, success } = useAppSelector(
    (state) => state.shoppingList
  );
  const { user } = useAppSelector((state) => state.login);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const sortQuery = (searchParams.get("sort") || "dateAdded") as
    | "name"
    | "category"
    | "dateAdded";

  const [showAddListModal, setShowAddListModal] = useState(false);
  const [editingList, setEditingList] = useState<Item | null>(null);
  const [newList, setNewList] = useState<Omit<Item, "userId">>({
    name: "",
    category: "",
    notes: "",
    image: "",
    quantity: 0,
  });

  const [selectedList, setSelectedList] = useState<Item | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [itemSearchQuery, setItemSearchQuery] = useState("");
  const [itemSortQuery, setItemSortQuery] = useState<
    "name" | "category" | "dateAdded"
  >("dateAdded");

  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: 1,
    dateAdded: "",
  });

  const [suppressNextAlert, setSuppressNextAlert] = useState(false);

  useEffect(() => {
    if (user?.id) dispatch(fetchItems(user.id));
  }, [dispatch, user]);

  useEffect(() => {
    if (suppressNextAlert) {
      if (error || success) {
        dispatch(clearMessages());
        setSuppressNextAlert(false);
      }
      return;
    }

    if (error) {
      alert(error);
      dispatch(clearMessages());
    }
    if (success) {
      alert(success);
      dispatch(clearMessages());
      if (user?.id) dispatch(fetchItems(user.id));
    }
  }, [error, success, dispatch, user, suppressNextAlert]);

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set("search", value);
    else params.delete("search");
    setSearchParams(params);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    setSearchParams(params);
  };

  const handleItemSearchChange = (value: string) => {
    setItemSearchQuery(value);
  };

  const handleItemSortChange = (value: string) => {
    setItemSortQuery(value as "name" | "category" | "dateAdded");
  };

  const handleListImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewList((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const openAddListModal = () => {
    setEditingList(null);
    setNewList({ name: "", category: "", notes: "", image: "", quantity: 0 });
    setShowAddListModal(true);
  };

  const openEditListModal = (list: Item) => {
    setEditingList(list);
    setNewList({
      name: list.name,
      category: list.category,
      notes: list.notes || "",
      image: list.image || "",
      quantity: list.quantity || 0,
    });
    setShowAddListModal(true);
  };

  const getListItemCount = (listId?: number) => {
    if (!listId) return 0;
    return items.filter((i) => (i as any).listId === listId).length;
  };

  const handleAddOrUpdateList = async () => {
    if (!newList.name || !newList.category) {
      alert("List name and category are required.");
      return;
    }
    if (!user?.id) {
      alert("You must be logged in.");
      return;
    }

    if (editingList) {
      const hasChanges =
        newList.name !== editingList.name ||
        newList.category !== editingList.category ||
        newList.notes !== (editingList.notes || "") ||
        newList.image !== (editingList.image || "");
      if (!hasChanges) {
        alert("Please make changes before updating.");
        return;
      }

      await dispatch(
        updateItem({
          ...newList,
          id: editingList.id,
          userId: user.id,
          dateAdded: editingList.dateAdded,
          quantity: getListItemCount(editingList.id),
        } as Item)
      );
    } else {
      await dispatch(
        addItem({
          ...newList,
          userId: user.id,
          quantity: 0,
        } as any)
      );
    }

    setNewList({ name: "", category: "", notes: "", image: "", quantity: 0 });
    setEditingList(null);
    setShowAddListModal(false);
  };

  const openViewModal = (list: Item) => {
    setSelectedList(list);
    setViewModalOpen(true);
  };
  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedList(null);
    setItemSearchQuery("");
    setItemSortQuery("dateAdded");
  };

  const openAddItemModal = (item?: Item) => {
    if (item) {
      setEditingItem(item);
      setNewItem({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        dateAdded: item.dateAdded?.slice(0, 10) || "",
      });
    } else {
      setEditingItem(null);
      setNewItem({
        name: "",
        category: "",
        quantity: 1,
        dateAdded: new Date().toISOString().slice(0, 10),
      });
    }
    setAddItemModalOpen(true);
  };

  const closeItemModal = () => {
    setAddItemModalOpen(false);
    setEditingItem(null);
    setNewItem({ name: "", category: "", quantity: 1, dateAdded: "" });
  };

  const handleAddOrUpdateItem = async () => {
    if (!newItem.name || !newItem.category) {
      alert("Name and Category are required.");
      return;
    }
    if (!user?.id || !selectedList?.id) {
      alert("No list selected or user not logged in.");
      return;
    }

    if (editingItem) {
      const hasChanges =
        newItem.name !== editingItem.name ||
        newItem.category !== editingItem.category ||
        newItem.quantity !== editingItem.quantity ||
        newItem.dateAdded !== editingItem.dateAdded?.slice(0, 10);
      if (!hasChanges) {
        alert("Please make changes before updating.");
        return;
      }

      await dispatch(
        updateItem({
          ...newItem,
          id: editingItem.id,
          userId: user.id,
          listId: selectedList.id,
          dateAdded: newItem.dateAdded,
        } as any)
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      setSuppressNextAlert(true);

      if (selectedList?.id) {
        const updatedCount = getListItemCount(selectedList.id);
        await dispatch(
          updateItem({
            ...selectedList,
            quantity: updatedCount,
            userId: user.id,
          } as Item)
        );
      }
    } else {
      await dispatch(
        addItem({
          ...newItem,
          userId: user.id,
          listId: selectedList.id,
          dateAdded: newItem.dateAdded || new Date().toISOString(),
        } as any)
      );
      await new Promise((resolve) => setTimeout(resolve, 100));
      setSuppressNextAlert(true);

      if (selectedList?.id) {
        const updatedCount = getListItemCount(selectedList.id);
        await dispatch(
          updateItem({
            ...selectedList,
            quantity: updatedCount + 1,
            userId: user.id,
          } as Item)
        );
      }
    }

    setAddItemModalOpen(false);
    setEditingItem(null);
    setNewItem({ name: "", category: "", quantity: 1, dateAdded: "" });
  };

  const handleDeleteList = async (id?: number) => {
    if (!id) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this list and all its items?"
    );
    if (!confirmed) return;

    const listItems = items.filter((i) => (i as any).listId === id);
    for (const item of listItems) {
      if (item.id) await dispatch(deleteItem(item.id));
    }

    await dispatch(deleteItem(id));
  };

  const handleDeleteItem = async (id?: number) => {
    if (!id) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmed) return;

    await dispatch(deleteItem(id));

    await new Promise((resolve) => setTimeout(resolve, 100));

    setSuppressNextAlert(true);

    if (selectedList?.id) {
      const updatedCount = getListItemCount(selectedList.id);
      await dispatch(
        updateItem({
          ...selectedList,
          quantity: Math.max(0, updatedCount - 1),
          userId: user?.id!,
        } as Item)
      );
    }
  };

  const filteredLists = items
    .filter((i) => i.userId === user?.id && (i as any).listId === undefined)
    .filter((i) => {
      const query = searchQuery.toLowerCase();
      return (
        i.name.toLowerCase().includes(query) ||
        i.category.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortQuery === "name") return a.name.localeCompare(b.name);
      if (sortQuery === "category") return a.category.localeCompare(b.category);
      if (sortQuery === "dateAdded")
        return (a.dateAdded || "").localeCompare(b.dateAdded || "");
      return 0;
    });

  const selectedListItems = selectedList
    ? items.filter((i) => (i as any).listId === selectedList.id)
    : [];

  const sortedAndFilteredItems = selectedListItems
    .filter((i) => {
      const query = itemSearchQuery.toLowerCase();
      return (
        i.name.toLowerCase().includes(query) ||
        i.category.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (itemSortQuery === "name") return a.name.localeCompare(b.name);
      if (itemSortQuery === "category")
        return a.category.localeCompare(b.category);
      if (itemSortQuery === "dateAdded")
        return (a.dateAdded || "").localeCompare(b.dateAdded || "");
      return 0;
    });

  const handleShare = (list: Item) => {
    const listItems = items.filter((it) => (it as any).listId === list.id);
    if (listItems.length === 0) {
      alert("This list has no items to share.");
      return;
    }
    const shareText =
      `${list.name}\n\n` +
      listItems.map((i) => `• ${i.name} - Quantity: ${i.quantity}`).join("\n");

    if (navigator.share) {
      navigator.share({ title: list.name, text: shareText }).catch(() => {
        navigator.clipboard.writeText(shareText);
        alert("List copied to clipboard!");
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("List copied to clipboard!");
    }
  };

  const allCategories = Array.from(
    new Set([...categories, ...items.map((i) => i.category).filter(Boolean)])
  );

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="controls">
          <Input
            placeholder="Search list or category..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <select
            value={sortQuery}
            onChange={(e) => handleSortChange(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="category">Sort by Category</option>
            <option value="dateAdded">Sort by Date</option>
          </select>
          <Button onClick={openAddListModal} className="btn-primary">
            + Add List
          </Button>
        </div>

        {showAddListModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowAddListModal(false)}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{editingList ? "Update List" : "Create New List"}</h2>
              <div className="form-group">
                <label>List Name *</label>
                <Input
                  placeholder="e.g., Weekly Groceries"
                  value={newList.name}
                  onChange={(e) =>
                    setNewList({ ...newList, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={newList.category}
                  onChange={(e) =>
                    setNewList({ ...newList, category: e.target.value })
                  }
                  className="sort-select"
                  style={{ width: "100%" }}
                >
                  <option value="">Select a category...</option>
                  {allCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Notes (optional)</label>
                <Input
                  placeholder="Add any notes..."
                  value={newList.notes}
                  onChange={(e) =>
                    setNewList({ ...newList, notes: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleListImageUpload}
                  className="file-input"
                />
                {newList.image && (
                  <div className="image-preview">
                    <img src={newList.image} alt="preview" />
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <Button onClick={handleAddOrUpdateList} className="btn-primary">
                  {editingList ? "Update List" : "Create List"}
                </Button>
                <Button
                  onClick={() => setShowAddListModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="items-grid">
          {loading ? (
            <div className="empty-state">
              <div className="loader"></div>
              <p>Loading your lists...</p>
            </div>
          ) : filteredLists.length === 0 ? (
            <div className="empty-state">
              <h3>No Lists Yet!</h3>
              <p>Start creating your first shopping list.</p>
              <Button onClick={openAddListModal} className="btn-primary">
                Create Your First List
              </Button>
            </div>
          ) : (
            filteredLists.map((list) => (
              <div key={list.id} className="list-card">
                <div className="list-card-image">
                  {list.image ? (
                    <img src={list.image} alt={list.name} />
                  ) : (
                    <div className="placeholder-image">
                    
                    </div>
                  )}
                </div>
                <div className="list-card-content">
                  <h3>{list.name}</h3>
                  <p className="category-badge">{list.category}</p>
                  {list.notes && <p className="notes">{list.notes}</p>}
                  <p className="quantity">Items: {getListItemCount(list.id)}</p>
                </div>
                <div className="card-actions">
                  <Button
                    onClick={() => openViewModal(list)}
                    className="btn-view"
                  >
                    View Items
                  </Button>
                  <Button
                    onClick={() => openEditListModal(list)}
                    className="btn-edit"
                  >
                    Edit
                  </Button>

                  <Button
                    onClick={() => handleDeleteList(list.id)}
                    className="btn-delete"
                  >
                    Delete
                  </Button>

                  <Button
                    onClick={() => handleShare(list)}
                    className="btn-share"
                  >
                    Share
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {viewModalOpen && selectedList && (
        <div className="fullscreen-modal">
          <div className="fullscreen-modal-content">
            <button className="close-button" onClick={closeViewModal}>
              ✕ Close
            </button>
            <div className="modal-header">
              <h2>{selectedList.name}</h2>
              <br />
            </div>
            <div className="controls">
              <Input
                placeholder="Search items or category..."
                value={itemSearchQuery}
                onChange={(e) => handleItemSearchChange(e.target.value)}
                className="search-input"
              />
              <select
                value={itemSortQuery}
                onChange={(e) => handleItemSortChange(e.target.value)}
                className="sort-select"
              >
                <option value="name">Sort by Name</option>
                <option value="category">Sort by Category</option>
                <option value="dateAdded">Sort by Date</option>
              </select>
              <Button
                onClick={() => openAddItemModal()}
                className="btn-primary"
              >
                + Add Item
              </Button>
            </div>
            {sortedAndFilteredItems.length === 0 ? (
              <div className="empty-state">
                <h3>No Items Yet!</h3>
                <p>
                  Add items to your {selectedList.name} list to get started.
                </p>
                <Button
                  onClick={() => openAddItemModal()}
                  className="btn-primary"
                >
                  Add Your First Item
                </Button>
              </div>
            ) : (
              <div className="items-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Date Added</th>
                      <th>Quantity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAndFilteredItems.map((i) => (
                      <tr key={i.id}>
                        <td>{i.name}</td>
                        <td>
                          <span className="table-badge">{i.category}</span>
                        </td>
                        <td>{i.dateAdded?.slice(0, 10)}</td>
                        <td>{i.quantity}</td>
                        <td className="action-cell">
                          <Button
                            onClick={() => openAddItemModal(i)}
                            className="btn-sm btn-edit"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteItem(i.id)}
                            className="btn-sm btn-delete"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {addItemModalOpen && (
              <div className="modal-overlay" onClick={closeItemModal}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <h2>{editingItem ? "Update Item" : "Add New Item"}</h2>
                  <div className="form-group">
                    <label>Item Name *</label>
                    <Input
                      placeholder="e.g., Milk"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={newItem.category}
                      onChange={(e) =>
                        setNewItem({ ...newItem, category: e.target.value })
                      }
                      className="sort-select"
                      style={{ width: "100%" }}
                    >
                      <option value="">Select a category...</option>
                      {allCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Quantity</label>
                    <Input
                      type="number"
                      value={String(newItem.quantity)}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          quantity: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Date Added</label>
                    <Input
                      type="date"
                      value={newItem.dateAdded}
                      onChange={(e) =>
                        setNewItem({ ...newItem, dateAdded: e.target.value })
                      }
                    />
                  </div>
                  <div className="modal-actions">
                    <Button
                      onClick={handleAddOrUpdateItem}
                      className="btn-primary"
                    >
                      {editingItem ? "Update Item" : "Add Item"}
                    </Button>
                    <Button onClick={closeItemModal} className="btn-secondary">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Home;