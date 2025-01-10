import { useEffect, useState } from 'react';
import { Button, Group, Modal, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAppDispatch, useAppSelector } from '../slices/hook';
import { addTodo, updateTodo, fetchTodos } from '../slices/todoSlices';

const AddTodo = () => {
  const [open, setOpen] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => state.todos.todos);
  const taiKhoan = JSON.parse(sessionStorage.getItem('taiKhoan') || "")
  const token:string = taiKhoan?.Token

  const form = useForm({
    initialValues: {
      title: '',
      body: '',
    },
  });

  useEffect(() => {
    console.log(taiKhoan)
    dispatch(fetchTodos(token));
  }, [dispatch]);

  const handleSubmit = () => {
    if (editTodo) {
      dispatch(updateTodo({ ...editTodo, ...form.values }));
      setEditTodo(null);
    } else {
      dispatch(addTodo({ id: Date.now(), ...form.values, done: false }));
    }
    setOpen(false);
    form.reset();
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Add Todo</Button>
      <Modal opened={open} onClose={() => setOpen(false)} title={editTodo ? 'Edit Todo' : 'Add Todo'}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="Title" required {...form.getInputProps('title')} />
          <Textarea label="Body" required {...form.getInputProps('body')} />
          <Group position="right" mt="md">
            <Button type="submit">{editTodo ? 'Update' : 'Create'}</Button>
          </Group>
        </form>
      </Modal>
      <div>
        {todos.map((todo) => (
          <div key={todo.id}>
            <h3>{todo.title}</h3>
            <p>{todo.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddTodo;
