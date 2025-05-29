# 📝 Project Setup Guide

Welcome! Follow the steps below to set up and run the project for development.

---

## 📦 Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (Recommended: v18 or above)
- [npm](https://www.npmjs.com/) (Comes with Node.js)
- Code Editor (e.g., [VS Code](https://code.visualstudio.com/))

---

## 🚀 Getting Started

1. **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/your-project.git
    cd your-project

    ```

2. **Install Dependencies**
    - Install all required packages defined in package.json:

    ```npm install

    ```

3. **Set Up Environment Variables**
    - Create a .env file in the root directory of the project and configure your environment variables. Example:
    ```
    SUPABASE_PROJECT_ID=your_supabase_project_id
    SUPABASE_API_KEY=your_supabase_api_key
    ```

4. **Start the development server**
    ```
    npm run dev
    ```
