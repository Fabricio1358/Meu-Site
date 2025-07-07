# Como instalar e configurar o Tailwind CSS em um projeto React

1. **Instale o Tailwind CSS e dependências:**

   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Configure os paths no `tailwind.config.js`:**

   ```js
   // tailwind.config.js
   module.exports = {
     content: [
       "./src/**/*.{js,jsx,ts,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

3. **Adicione as diretivas do Tailwind no seu CSS principal:**
   Crie (ou edite) o arquivo `src/index.css` e adicione:

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. **Importe o CSS no seu projeto:**
   No seu `src/index.tsx` ou `src/App.tsx`, adicione:

   ```tsx
   import './index.css';
   ```

5. **Reinicie o servidor de desenvolvimento:**

   ```bash
   npm start
   ```

Pronto! Agora você pode usar as classes do Tailwind CSS nos seus componentes.
