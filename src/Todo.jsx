import React, { useEffect, useRef, useState } from "react";

function Todo(props) {
    const [todos, setTodos] = useState([]);
    const [value, setValue] = useState("");
    const [checkedAll, setCheckedAll] = useState(false);
    const [selectedModifyId, setSelectedModifyId] = useState(0);
    const [modifyInputValue, setModifyInputValue] = useState(0);

    // const [id1, setId1] = useState(0);      1번째 방법 : useState를 사용해서 ID값 증가
    // const saveTodo = () => {
    // const todo = {
    //         id: id1+ 1,
    //         content: value,
    //         date: new Date().toLocaleString(),
    //     };
    //     setTodos((prev) => [...prev, todo]);
    //     setId1(prev => prev + 1)
    // };

    // const id2 = useRef(0);                // 2번째 방법 : useRef로 ID값 증가
    // const saveTodo = () => {
    //     const todo = {
    //         id: id2.current + 1,
    //         content: value,
    //         date: new Date().toLocaleString(),
    //     };
    //     setTodos((prev) => [...prev, todo]);
    //     id2.current += 1 ;
    // };

    const saveTodo = () => {
        // 3번째 방법
        const todo = {
            id: todos.length === 0 ? 1 : todos[todos.length - 1].id + 1,
            content: value,
            date: new Date(),
            checked: false,
        };
        setTodos((prev) => [...prev, todo]);
        setValue("");
    };

    const handleCheckOnChange = (e, todoId) => {
        setTodos((prev) =>
            prev.map((todo) => {
                if (todo.id === todoId) {
                    return {
                        ...todo,
                        checked: !todo.checked,
                    };
                }
                return todo;
            })
        );
    };

    useEffect(() => {
        if (todos.length > 0) {
            if (todos.reduce((prev, current) => prev && current.checked, true)) {
                // 현재 todo.checked가 모두 체크되어 있으면 true, 아니면 false
                // reduce 쓸 때 : 반복하면서 연산을 해야할때
                // prev : 이전의 연산 결과인데
                // 최초 prev값은 아무값이 없으니깐? => true 넣어줌
                // 다음 연산 결과는 prev에 저장된다
                setCheckedAll(true);
            } else {
                setCheckedAll(false);
            }
        }
    }, [todos]);

    const handleAllCheckOnChange = (e) => {
        setCheckedAll(e.target.checked);
        setTodos((prev) =>
            prev.map((todo) => ({
                ...todo,
                checked: e.target.checked,
            }))
        );
    };

    const handleSelectedRowsDeleteOnClick = () => {
        setTodos((prev) => prev.filter((todo) => !todo.checked));
    };

    const resetSelectedModifyId = () => {
        setSelectedModifyId(0);
    };

    const handleModifyOnClick = (e, todoId) => {
        setSelectedModifyId(todoId);
        setModifyInputValue(todos.find((todo) => todo.id === todoId).content);
    };

    const modifyTodo = () => {
        setTodos((prev) =>
            prev.map((todo) => {
                if (todo.id === selectedModifyId) {
                    return {
                        ...todo,
                        content: modifyInputValue,
                    };
                }
                return todo;
            })
        );
    };

    const handleModifyInputOnChange = (e) => {
        setModifyInputValue(e.target.value);
    };

    const handleModifyOkOnClick = () => {
        modifyTodo();
        resetSelectedModifyId();
    };

    const handleModifyCancelOnClick = () => {
        resetSelectedModifyId();
    };

    return (
        <div>
            <header>
                <input
                    type="text"
                    autoFocus
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.keyCode === 13) saveTodo();
                    }}
                />
                <button onClick={() => saveTodo()}>확인</button>
                <button onClick={handleSelectedRowsDeleteOnClick}>선택 삭제</button>
            </header>
            <table>
                <thead>
                    <tr>
                        <th>
                            <input type="checkbox" checked={checkedAll} onChange={handleAllCheckOnChange} />
                        </th>
                        <th>번호</th>
                        <th>내용</th>
                        <th>날짜</th>
                        <th>수정</th>
                        {selectedModifyId !== 0 ? <></> : <th>삭제</th>}
                    </tr>
                </thead>
                <tbody>
                    {todos.map((todo) => (
                        <tr key={todo.id}>
                            <td>
                                <input type="checkbox" checked={todo.checked} onChange={(e) => handleCheckOnChange(e, todo.id)} />
                            </td>
                            <td>{todo.id}</td>
                            <td>
                                {selectedModifyId !== todo.id ? (
                                    todo.content
                                ) : (
                                    <input
                                        autoFocus
                                        value={modifyInputValue}
                                        onChange={handleModifyInputOnChange}
                                        onKeyDown={(e) => {
                                            if (e.keyCode === 13) handleModifyOkOnClick();
                                        }}
                                    />
                                )}
                            </td>
                            <td>{todo.date.toLocaleString()}</td>
                            <td>
                                {selectedModifyId !== todo.id ? (
                                    <button onClick={(e) => handleModifyOnClick(e, todo.id)}>수정</button>
                                ) : (
                                    <>
                                        <button onClick={handleModifyOkOnClick}>확인</button>
                                        <button onClick={handleModifyCancelOnClick}>취소</button>
                                    </>
                                )}
                            </td>
                            <td>
                                {selectedModifyId !== 0 ? (
                                    <></>
                                ) : (
                                    <td>
                                        <button onClick={() => setTodos((prev) => prev.filter((t) => t.id !== todo.id))}>삭제</button>
                                    </td>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Todo;
