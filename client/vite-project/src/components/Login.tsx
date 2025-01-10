import { Anchor, Box, Button, Checkbox, Group, Paper, PasswordInput, Text, TextInput, Title } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { ENDPOINT } from '../App';
import { useForm } from '@mantine/form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [taiKhoan,setTaiKhoan] = useState(null);
    const navigate = useNavigate()

    const loginForm = useForm({
        initialValues:{
            username: "",
            password: ""
        }
    })

    const handleLogin = async(values:{username: string, password: string})=>{
        console.log(JSON.stringify(values))
        let errord = ""
        try {
            await toast.promise(
                fetch(`${ENDPOINT}/api/todos/login`,{
                    method: "POST",
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(values)
                }).then(async(r)=>{
                    if(!r.ok){
                        const errorResponse = await r.json();
                        errord = errorResponse.error
                        throw new Error(errorResponse.error || "Something went wrong")
                    }
                    return r.json()
                }),
                {
                    pending: 'Logging in...',
                    success: 'Successfully logged in!'
                }
            ).then((data)=>{
                setTaiKhoan(data)
                setTimeout(()=>{
                    navigate('/add-todo')
                },1500)
            })
           
        } catch (error) {
            toast.error(errord)
        }
    }

    useEffect(()=>{
        const saveLoginDetails = ()=>{
            console.log(taiKhoan)
            sessionStorage.setItem("taiKhoan",JSON.stringify(taiKhoan) || "");
        }
        saveLoginDetails()
    },[taiKhoan])

    return (
        <div>
            <Box className='registerBox'>
                <Title ta="center" className='registerTitle'>
                    Welcome back!
                </Title>
                <Text c="dimmed" size='sm' ta="center" mt={5}>
                    Do not have an account yet?{' '}
                    <Anchor size='sm' component='button'>
                        Create an account
                    </Anchor>
                </Text>

                <Paper shadow='md' p={30} mt={30} radius="md">
                    <form action="" onSubmit={loginForm.onSubmit(handleLogin)}>
                        <TextInput label="Username" placeholder='Username' {...loginForm.getInputProps("username")} required />
                        <PasswordInput label="Password" placeholder='Password' {...loginForm.getInputProps("password")} required />
                        <Group justify='space-between' mt={"lg"}>
                            <Checkbox label="Remember me"/>
                            <Anchor component='button' size='sm'>
                                Forgot password ?
                            </Anchor>
                        </Group>
                        <Button type='submit' fullWidth mt="xl">
                            Sign in
                        </Button>
                    </form>
                </Paper>

            </Box>
        </div>
    );
};

export default Login;