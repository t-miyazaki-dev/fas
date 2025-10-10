import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import axios from "axios";
export default function App() {
    //Read
    const [id, setId] = useState("");
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const handleGetUser = async () => {
        try {
            // setError("")
            const res = await axios.get(`http://localhost:3000/user/${id}`);
            setUser(res.data);
        }
        catch (err) {
            // setUser(null)
            setError("見つかりません");
            //これうまくいかん
        }
    };
    //create
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [newUser, setNewUser] = useState(null);
    const handleCreateUser = async () => {
        try {
            const res = await axios.post(`http://localhost:3000/user`, {
                name,
                age: Number(age),
            });
            setNewUser(res.data);
            setName("");
            setAge("");
        }
        catch (err) {
            alert("登録に失敗しました");
        }
    };
    //Update
    const [updateName, setUpdateName] = useState("");
    const [updateAge, setUpdateAge] = useState("");
    const [updateId, setUpdateId] = useState("");
    const handleUpdateUser = async () => {
        try {
            const res = await axios.patch(`http://localhost:3000/user/${updateId}`, {
                name: updateName,
                age: Number(updateAge),
            });
            setUser(res.data);
            //あとで確認
            alert("ユーザー情報を更新しました");
        }
        catch (err) {
            console.log(err);
            alert("更新に失敗しました");
        }
    };
    return (_jsxs("div", { children: [_jsx("h1", { children: "\u30E6\u30FC\u30B6\u30FC\u691C\u7D22" }), _jsx("input", { type: "number", value: id, onChange: (e) => setId(e.target.value), placeholder: '\u30E6\u30FC\u30B6\u30FCID\u3092\u5165\u529B' }), _jsx("button", { onClick: handleGetUser, children: "\u691C\u7D22" }), user && (_jsxs("div", { children: [_jsx("h2", { children: "\u30E6\u30FC\u30B6\u60C5\u5831" }), _jsxs("p", { children: ["ID: ", user.id] }), _jsxs("p", { children: ["\u540D\u524D: ", user.name] }), _jsxs("p", { children: ["\u5E74\u9F62:", user.age] })] })), error && _jsx("p", { children: error }), _jsx("hr", {}), _jsx("h1", { children: "\u30E6\u30FC\u30B6\u30FC\u4F5C\u6210" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "\u540D\u524D" }), _jsx("input", { type: "number", value: age, onChange: (e) => setAge(e.target.value), placeholder: "\u5E74\u9F62" }), _jsx("button", { onClick: handleCreateUser, children: "\u767B\u9332" }), newUser && (_jsxs("div", { children: [_jsx("p", { children: "\u4F5C\u6210\u3055\u308C\u305F\u30E6\u30FC\u30B6\u30FC" }), _jsxs("p", { children: ["ID:", newUser.id] }), _jsxs("p", { children: ["\u540D\u524D:", newUser.name] }), _jsxs("p", { children: ["\u5E74\u9F62:", newUser.age] })] })), _jsx("hr", {}), _jsx("h1", { children: "\u30E6\u30FC\u30B6\u30FC\u66F4\u65B0" }), _jsx("input", { type: "number", value: updateId, onChange: (e) => setUpdateId(e.target.value), placeholder: "\u66F4\u65B0\u3059\u308BID" }), _jsx("input", { type: "text", value: updateName, onChange: (e) => setUpdateName(e.target.value), placeholder: "\u65B0\u3057\u3044\u540D\u524D" }), _jsx("input", { type: "number", value: updateAge, onChange: (e) => setUpdateAge(e.target.value), placeholder: "\u65B0\u3057\u3044\u5E74\u9F62" }), _jsx("button", { onClick: handleUpdateUser, children: "\u66F4\u65B0" })] }));
}
//# sourceMappingURL=App.js.map