import { QueryClient, useQuery } from '@tanstack/react-query'
import React from 'react'
import { reqTodo } from '../api/TodoApi';

function todoQuery(props) {

  return useQuery({
        queryKey: ["todolist"],
        queryFn: async () => await reqTodo(),
        staleTime: 1000 * 60 * 60,      
        gcTime: 1000 * 60 * 60,
    });
}

export default todoQuery;