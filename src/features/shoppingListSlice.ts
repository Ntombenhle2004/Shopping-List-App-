import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { api } from "../api/api";

export interface Item {
  id?: number;
  userId?: number; // ✅ Each item belongs to a user
  name: string;
  quantity: number;
  category: string;
  notes?: string;
  image?: string;
  dateAdded?: string;
}

interface ShoppingListState {
  items: Item[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: ShoppingListState = {
  items: [],
  loading: false,
  error: null,
  success: null,
};

// Fetch items for specific user
export const fetchItems = createAsyncThunk<
  Item[],
  number, // ✅ Pass userId
  { rejectValue: string }
>("shoppingList/fetchItems", async (userId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/shoppingLists?userId=${userId}`);
    return data;
  } catch (err: any) {
    console.error("Axios fetchItems error:", err);
    return rejectWithValue("Failed to fetch items from server.");
  }
});


// Add item
export const addItem = createAsyncThunk<
  Item,                          // return type
  Omit<Item, "id" | "dateAdded">, // input type (userId required, id/dateAdded auto)
  { rejectValue: string }
>("shoppingList/addItem", async (item, { rejectWithValue }) => {
  if (!item.name || !item.category) {
    return rejectWithValue("Name and Category are required");
  }
  if (!item.userId) {
    return rejectWithValue("User ID is required");
  }

  try {
    const { data } = await api.post("/shoppingLists", {
      ...item,
      dateAdded: new Date().toISOString(),
    });
    return data;
  } catch (err) {
    console.error("Axios addItem error:", err);
    return rejectWithValue("Failed to add item. Check server connection.");
  }
});

// Update item
export const updateItem = createAsyncThunk<Item, Item, { rejectValue: string }>(
  "shoppingList/updateItem",
  async (item, { rejectWithValue }) => {
    if (!item.name || !item.category)
      return rejectWithValue("Name and Category are required for update");
    if (!item.id) return rejectWithValue("Item ID missing");
    try {
      const { data } = await api.put(`/shoppingLists/${item.id}`, item);
      return data;
    } catch {
      return rejectWithValue("Failed to update item. Check server connection.");
    }
  }
);

// Delete item
export const deleteItem = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("shoppingList/deleteItem", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/shoppingLists/${id}`);
    return id;
  } catch {
    return rejectWithValue("Failed to delete item. Check server connection.");
  }
});

const shoppingListSlice = createSlice({
  name: "shoppingList",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchItems.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to fetch items";
      })
      // Add
      .addCase(addItem.fulfilled, (state, action: PayloadAction<Item>) => {
        state.items.push(action.payload);
        state.success = "Item added successfully";
      })
      .addCase(addItem.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to add item";
      })
      // Update
      .addCase(updateItem.fulfilled, (state, action: PayloadAction<Item>) => {
        const index = state.items.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        state.success = "Item updated successfully";
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to update item";
      })
      // Delete
      .addCase(deleteItem.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
        state.success = "Item deleted successfully";
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to delete item";
      });
  },
});

export const { clearMessages } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
