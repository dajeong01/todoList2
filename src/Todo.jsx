import React, { useEffect, useRef, useState } from 'react';
import api from './api/axios';

import { reqDeleteAll, reqDeleteOne, reqGetList, reqModify, reqRegister } from './api/TodoApi';

function Todo(props) {
    const [ todos, setTodos ] = useState([]);
    const [ value, setValue ] = useState("");
    const [ checkedAll, setCheckedAll ] = useState(false);
    const [ selectedModifyId, setSelectedModifyId ] = useState(0);
    const [ modifyInputValue, setModifyInputValue ] = useState(0);

    useEffect(() => {
        getTodoList();
    }, [])

    const getTodoList = () => {
        reqGetList().then(response => setTodos(response.data));
    }

    // useState를 사용해서 ID 값 증가
    // const [ id1, setId1 ] = useState(0);
    // const saveTodo = () => {
    //     const todo = {
    //         id: id1 + 1,
    //         content: value,
    //     }
        
    //     setTodos(prev => [...prev, todo]);
    //     setId1(prev => prev + 1);
    // }

    // useRef로 ID값 증가
    // const id2 = useRef(0);
    // const saveTodo = () => {
    //     const todo = {
    //         id: id2.current + 1,
    //         content: value,
    //     }
        
    //     setTodos(prev => [...prev, todo]);
    //     id2.current += 1;
    // }

    const saveTodo = () => {
        const todo = {
            content: value,
            date: new Date(),
        }
        reqRegister(todo).then(response => {
            if (response.status === 200) {
                getTodoList();
            }
        });
    }

    useEffect(() => {
        // const nums = [1,1,1,1,1,1];
        // const fx = (pn, cn) => {
        //     return pn + cn
        // }
        
        // const result = nums.reduce(fx, 10);

        if (todos.length > 0) {
            if (todos.reduce((prev, current) => prev && current.checked, true)) {
                setCheckedAll(true);
            } else {
                setCheckedAll(false);
            }
        }
    }, [todos])

    const handleCheckAllOnChange = (e) => {
        setCheckedAll(e.target.checked);
        setTodos(prev => prev.map(todo => ({
            ...todo,
            checked: e.target.checked,
        })))
    }

    const handleCheckOnChange = (e, todoId) => {
        setTodos(prev => prev.map(todo => {
            if (todo.id === todoId) {
                return {
                    ...todo,
                    checked: !todo.checked,
                }
            }
            return todo;
        }));
    }

    const handleSelectedRowsDeleteOnClick = () => {
        setTodos(prev => prev.filter(todo => !todo.checked));
        console.log(todos.filter(todo => todo.checked))
        reqDeleteAll(todos.filter(todo => todo.checked).map(todo => todo.id));
    }

    const resetSelectedModifyId = () => {
        setSelectedModifyId(0);
    }

    const handleModifyOnClick = (e, todoId) => {
        setSelectedModifyId(todoId);
        setModifyInputValue(todos.find(todo => todo.id === todoId).content);
    }

    const modifyTodo = () => {
        setTodos(prev => prev.map(todo => {
            if (todo.id === selectedModifyId) {
                return {
                    ...todo,
                    content: modifyInputValue,
                }
            }
            return todo;
        }));
        const todo = {
            content: modifyInputValue,
        }
        reqModify(selectedModifyId, todo);
    }

    const handleModifyInputOnChange = (e) => {
        setModifyInputValue(e.target.value);
    }

    const handleModifyOkOnClick = () => {
        modifyTodo();
        resetSelectedModifyId();
    }

    const handleModifyCancelOnClick = () => {
        resetSelectedModifyId();
    }

    return (
        <div>
            <header>
                <input type="text" autoFocus value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={ (e) => { if(e.keyCode === 13) saveTodo() } } />
                <button onClick={ () => saveTodo() }>확인</button>
                <button onClick={ handleSelectedRowsDeleteOnClick }>선택삭제</button>
            </header>
            <table>
                <thead>
                    <tr>
                        <th><input type="checkbox" checked={checkedAll} onChange={handleCheckAllOnChange} /></th>
                        <th>번호</th>
                        <th>내용</th>
                        <th>날짜</th>
                        <th>수정</th>
                        {
                            selectedModifyId !== 0
                            ? <></>
                            : <th>삭제</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        todos.map(todo => (
                            <tr key={todo.id}>
                                <td><input type="checkbox" checked={todo.checked} onChange={(e) => handleCheckOnChange(e, todo.id)} /></td>
                                <td>{todo.id}</td>
                                <td>{selectedModifyId !== todo.id ? todo.content : <input autoFocus value={modifyInputValue} onChange={handleModifyInputOnChange} onKeyDown={(e) => {if (e.keyCode === 13) handleModifyOkOnClick()}} />}</td>
                                <td>{todo.date.toLocaleString()}</td>
                                <td>
                                    {
                                        selectedModifyId !== todo.id
                                        ? <button onClick={(e) => handleModifyOnClick(e, todo.id)}>수정</button>
                                        : <>
                                            <button onClick={handleModifyOkOnClick}>확인</button>
                                            <button onClick={handleModifyCancelOnClick}>취소</button>
                                        </>
                                    }
                                </td>
                                {
                                    selectedModifyId !== 0
                                    ? <></>
                                    : <td><button onClick={() => {
                                        setTodos(prev => prev.filter(t => t.id !== todo.id));
                                        reqDeleteOne(todo.id);
                                    }}>삭제</button></td>
                                }
                                
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}

export default Todo;