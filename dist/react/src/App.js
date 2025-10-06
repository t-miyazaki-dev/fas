import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import axios from "axios";
export default function App() {
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
        }
    };
    return (_jsxs("div", { children: [_jsx("h1", { children: "User Search" }), _jsx("input", { type: "number", value: id, onChange: (e) => setId(e.target.value), placeholder: '\u30E6\u30FC\u30B6\u30FCID\u3092\u5165\u529B' }), _jsx("button", { onClick: handleGetUser, children: "\u691C\u7D22" }), user && (_jsxs("div", { children: [_jsx("h2", { children: "\u30E6\u30FC\u30B6\u60C5\u5831" }), _jsxs("p", { children: ["ID: ", user.id] }), _jsxs("p", { children: ["\u540D\u524D: ", user.name] }), _jsxs("p", { children: ["\u5E74\u9F62:", user.age] })] })), error && _jsx("p", { children: error })] }));
}
//# sourceMappingURL=App.js.map