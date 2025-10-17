# 🛒 Shopping List App (React + Redux + Vite + TypeScript)

A modern **shopping list application** built with **React 18**, **Redux Toolkit**, **TypeScript**, and **Vite**.  
Supports user registration, login, adding shopping lists with images, search and sort functionality, profile management, and secure protected routes.  

---

## 🚀 Features

- 👤 **User Authentication**
  - Registration with encrypted passwords
  - Login with password verification
  - Logout functionality
- 📝 **Shopping List Management**
  - Add new shopping lists with name, quantity, category, notes, and optional image
  - Search and sort shopping lists
  - LocalStorage + Redux state management
- 🔒 **Protected Routes**
  - `/home`, `/profile`, `/privacy` accessible only to logged-in users
- ⚡ **Profile Management**
  - Update user information and profile picture
- 📦 **Backend**
  - JSON Server used as mock backend for storing users and lists

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Redux Toolkit, React Router DOM v6
- **State Management**: Redux Toolkit + localStorage persistence
- **Backend**: JSON Server
- **Styling**: CSS Modules or standard CSS
- **Build Tool**: Vite

---

## 📦 Dependencies

### Main
- `react` ^18.2.0
- `react-dom` ^18.2.0
- `react-router-dom` ^6.15.0
- `react-redux` ^9.2.0
- `@reduxjs/toolkit` ^2.9.0
- `axios` ^1.12.2
- `react-icons` ^5.5.0

### Dev
- `vite` ^7.1.7
- `typescript` ~5.9.3
- `@vitejs/plugin-react` ^5.0.4
- `eslint` ^9.36.0
- `json-server` ^1.0.0-beta.3
- `@types/react` ^18.2.7
- `@types/react-dom` ^18.2.4
- `typescript-eslint` ^8.45.0

---

## ⚡ Running the Project

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/shopping-list-app.git
cd shopping-list-app
npm install
```

Start JSON Server (mock backend):

```bash
npx json-server --watch db.json --port 5000
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## 📝 Pseudocode

Below is high-level pseudocode for the main app logic:

### 1. Registration
```
FUNCTION registerUser(name, surname, email, password, cell)
    encryptedPassword = encrypt(password)
    newUser = { name, surname, email, encryptedPassword, cell }
    SAVE newUser TO JSONServer
    SHOW "Registration successful"
END FUNCTION
```

### 2. Login
```
FUNCTION loginUser(email, password)
    FETCH user FROM JSONServer WHERE user.email == email
    IF user EXISTS
        decryptedPassword = decrypt(user.encryptedPassword)
        IF decryptedPassword == password
            SET currentUser = user
            SAVE currentUser TO Redux AND localStorage
            NAVIGATE to HomePage
        ELSE
            SHOW "Incorrect password"
    ELSE
        SHOW "User not found"
END FUNCTION
```

### 3. Add Shopping List
```
FUNCTION addShoppingList(name, quantity, category, notes, image)
    newList = {
        name, quantity, category, notes, image,
        dateAdded = currentDate,
        userId = currentUser.id
    }
    DISPATCH addList(newList)
    SAVE newList TO JSONServer
END FUNCTION
```

### 4. Search and Sort
```
FUNCTION handleSearch(searchTerm)
    UPDATE URL WITH ?search=searchTerm
    FILTER lists WHERE list.name CONTAINS searchTerm
END FUNCTION

FUNCTION handleSort(sortType)
    UPDATE URL WITH ?sort=sortType
    SORT lists BASED ON sortType
END FUNCTION
```

### 5. Protected Route
```
IF user IS NOT loggedIn
    REDIRECT TO /login
ELSE
    RENDER requestedPage
END IF
```

### 6. Profile Update
```
FUNCTION updateProfile(updatedUser)
    UPDATE user IN JSONServer
    DISPATCH updateUser(updatedUser)
    SHOW "Profile updated successfully"
END FUNCTION
```

### 7. Logout
```
FUNCTION logout()
    CLEAR currentUser FROM Redux AND localStorage
    NAVIGATE TO /login
END FUNCTION
```

---

## 📂 Project Structure

```
src/
 ├── components/
 │    └── (UI components, buttons, cards, inputs)
 ├── pages/
 │    ├── Landing.tsx
 │    ├── Login.tsx
 │    ├── Register.tsx
 │    ├── Home.tsx
 │    ├── Profile.tsx
 │    └── Privacy.tsx
 ├── routes/
 │    └── protectRoute.tsx
 ├── store/
 │    └── redux slices & store setup
 ├── App.tsx
 └── main.tsx
```

---

## 📝 License

MIT License © 2025 — Built for learning & demo purposes.
