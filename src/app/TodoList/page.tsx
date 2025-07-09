
import React from 'react'
import {  HydrateClient } from '~/trpc/server';
import Todolist from '../_components/ToDoList/Todolist';

async function page() {
    
  return (
    <HydrateClient>
         <Todolist/>
    </HydrateClient>
  )
}

export default page