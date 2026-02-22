# Instructions to run the project

## 1. Install Node.js and npm

It's recommended to use a version manager like `nvm` (Node Version Manager) to install Node.js and npm. This allows you to easily switch between different Node.js versions.

First, install `nvm` by running the following command in your terminal:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```
After the installation is complete, close and reopen your terminal. Then, install the latest LTS (Long Term Support) version of Node.js:
```bash
nvm install --lts
```
This will install both Node.js and npm.

## 2. Verify the installation

To verify that `npm` is installed correctly, run the following command:
```bash
npm -v
```
This should print the installed version of `npm`.

## 3. Install Dependencies

*   Open a terminal and navigate to the `Backened` directory. Run `npm install`.
*   Open another terminal and navigate to the root of the project. Run `npm install`.

## 4. Start the Servers

*   In the `Backened` directory, run `node register_login.js` to start the backend server.
*   In the root directory, run `npm run dev` to start the frontend development server.

## 5. View the Application

Open your browser and go to `http://localhost:5173`.