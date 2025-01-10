import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface Todo {
  id: number;
  title: string;
  body: string;
  done: boolean;
}

interface TodosState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodosState = {
  todos: [],
  loading: false,
  error: null,
};

// Async actions
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async (token: string) => {
  console.log("This is the token: ",token)
  const response = await fetch('http://localhost:4000/api/todos/getAll',{
    method: 'GET',
    headers:{
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return (await response.json()) as Todo[];
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id: number) => {
  await fetch(`http://localhost:4000/api/todos/${id}`, { method: 'DELETE' });
  return id;
});

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    updateTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.todos.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch todos';
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      });
  },
});

export const { addTodo, updateTodo } = todosSlice.actions;
export default todosSlice.reducer;
