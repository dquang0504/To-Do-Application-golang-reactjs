import { Provider } from 'react-redux';
import { store } from './slices/index';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { DoubleNavbar } from './components/SideNav';
import AddTodo from './components/AddTodo';
import Login from './components/Login';
import './App.css'
/* eslint-disable  @typescript-eslint/no-explicit-any */

export const ENDPOINT = "http://localhost:4000"

interface PrivateRouteProps {
  element: React.ComponentType<any>;
  [key: string]: any
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({element: Element, ...rest})=>{
  const taiKhoan = JSON.parse(sessionStorage.getItem('taiKhoan') || "")
  return taiKhoan ? (
    <Element {...rest} />
  ):(
    <Navigate to={'/account'}></Navigate>
  )
}

function App() {
  return (
    <Provider store={store}>
        <div className="app-container">
          <DoubleNavbar />
          <div className="content-container">
            <Routes>
              <Route path="/" element={<div>Welcome to the App</div>} />
              <Route path="/home" element={<div>Home Page</div>} />
              <Route path="/account" element={<Login />} />
              <Route path="/add-todo" element={ <PrivateRoute element={<AddTodo/>} /> } />
            </Routes>
          </div>
          <ToastContainer />
        </div>
    </Provider>
  );
}

export default App;
