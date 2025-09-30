# Room Renovation Visualizer Requirements

## 1. General

- **Platform:** Mobile web browser.
- **User Authentication:** No user login required (client-agnostic).
- **Session Management:**
    - A unique session ID will be generated for each new user session.
    - Sessions will automatically expire after 10 minutes of inactivity.

## 2. Page Structure and Flow

The application will be a single-page application with three main sections:

1.  **Category Selection**
2.  **Room Photo Display**
3.  **Product Selection**

### 2.1. Category Selection

- **Display:** A top-level section will display main categories of home decoration products (e.g., "Flooring," "Tile," "Paint").
- **Interaction:**
    - The category section will be horizontally scrollable if the number of categories exceeds the screen width.
    - Clicking on a main category will reveal a dropdown list of sub-categories.
    - Selecting a sub-category will filter the products displayed in the Product Selection section.

### 2.2. Room Photo Display

- **Initial State (First Visit):**
    - The section will be blank.
    - A message will prompt the user to upload a photo of their room.
- **With User-Uploaded Photo:**
    - If the user has uploaded a photo and no product is selected, this section will display the user's original photo.
- **With Product Selected:**
    - When the user selects a product from the Product Selection section, this section will display a generated image showing the product applied to the user's room photo.

### 2.3. Product Selection

- **Display:** This section will display products based on the selected category/sub-category.
- **Pagination:**
    - Products will be displayed in a paginated grid.
    - Each page will show 12 products.
    - New products will be loaded automatically as the user scrolls down (infinite scrolling).
- **Interaction:**
    - Clicking on a product will trigger the Room Photo Display to update with a generated image.
