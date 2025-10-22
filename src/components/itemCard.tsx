import React, { useState } from "react";
import type { Item } from "../features/shoppingListSlice";
import Button from "./Button";
import Input from "./Input";

interface Props {
  item: Item;
  onUpdate: (item: Item) => void;
  onDelete: (item: Item) => void;
}

const ItemCard: React.FC<Props> = ({ item, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category);
  const [quantity, setQuantity] = useState(item.quantity);
  const [notes, setNotes] = useState(item.notes || "");
  const [image, setImage] = useState(item.image || "");

  const handleSave = () => {
    if (!name || !category) return alert("Name and Category required");
    onUpdate({ ...item, name, category, quantity, notes, image });
    setEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="item-card">
      {editing ? (
        <>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
          />
          <Input
            type="number"
            value={String(quantity)}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="Quantity"
          />
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes"
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {image && (
            <img
              src={image}
              alt="Preview"
              style={{ width: "100px", marginTop: "10px" }}
            />
          )}
          <div className="item-buttons">
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </>
      ) : (
        <>
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              style={{ width: "100%", maxWidth: "200px" }}
            />
          )}
          <h3>{item.name}</h3>
          <p>
            <strong>Category:</strong> {item.category}
          </p>
          <p>
            <strong>Quantity:</strong> {item.quantity}
          </p>
          {item.notes && (
            <p>
              <strong>Notes:</strong> {item.notes}
            </p>
          )}
          {item.dateAdded && (
            <p>
              <small>
                Added: {new Date(item.dateAdded).toLocaleDateString()}
              </small>
            </p>
          )}
          <div className="item-buttons">
            <Button onClick={() => setEditing(true)}>Edit</Button>
            <Button
              onClick={() => {
                if (window.confirm("Delete this item?")) onDelete(item);
              }}
            >
              Delete
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ItemCard;

