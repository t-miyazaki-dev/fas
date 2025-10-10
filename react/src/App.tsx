import { useState } from 'react';

import axios from "axios"


export default function App() {
  //Read
  const [id, setId] = useState("")
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState("")

  const handleGetUser = async () => {
    try {
      setError("")
      const res = await axios.get(`http://localhost:3000/user/${id}`)

      if (!res.data || !res.data.id) { // データがない場合
        setUser(null);
        setError("見つかりません");
      } else {
        setUser(res.data);
        setError("");
      }

    } catch (err) {
      setUser(null)
      setError("見つかりません")
      //これうまくいかん
      //うまくいった
    }
  }

  //create
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [newUser, setNewUser] = useState<any>(null);

  const handleCreateUser = async () => {
    try {
      const res = await axios.post(`http://localhost:3000/user`, {
        name,
        age: Number(age),
      })
      setNewUser(res.data);
      setName("");
      setAge("")
    } catch (err) {
      alert("登録に失敗しました");
    }
  }

  //Update
  const [updateName, setUpdateName] = useState("");
  const [updateAge, setUpdateAge] = useState("");
  const [updateId, setUpdateId] = useState("");


  const handleUpdateUser = async () => {
    try {
      const res = await axios.patch(`http://localhost:3000/user/${updateId}`, {
        name: updateName,
        age: Number(updateAge),
      })
      setUser(res.data)
      //あとで確認
      alert("ユーザー情報を更新しました")
    } catch (err) {
      console.log(err);
      alert("更新に失敗しました")
    }
  }

  //delete
  const [deleteId, setDeleteId] = useState("");

  const handleDeletedUser = async () => {
    try {
      const res = await axios.delete(`http://localhost:3000/user/${deleteId}`,)
      if (!res.data || !res.data.id) {
        alert("ユーザーが存在しません");
      } else {
        alert(`ユーザーを削除しました`);
      }
      setDeleteId(res.data)
      //?
    } catch (err) {
      alert("削除に失敗しました")
    }
  }

  //ユーザー登録

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regAge, setRegAge] = useState("");
  const [regMessage, setRegMessage] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:3000/register", {
        name: regName,
        email: regEmail,
        password: regPassword,
        age: regAge ? Number(regAge) : undefined,
      });
      setRegMessage("送信成功（まだサーバーは存在しません）");
      setRegName("");
      setRegEmail("");
      setRegPassword("");
      setRegAge("");
    } catch (err) {
      setRegMessage("送信失敗（サーバーはまだ存在しません）");
    }
  };



  return (
    <div>
      {/* Read */}
      <h1>ユーザー検索</h1>
      <input
        type="number"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder='ユーザーIDを入力'
      />
      <button onClick={handleGetUser}>検索</button>

      {user && (
        <div>
          <h2>ユーザ情報</h2>
          <p>ID: {user.id}</p>
          <p>名前: {user.name}</p>
          <p>年齢:{user.age}</p>
        </div>
      )}

      {error && <p>{error}</p>}

      <hr />

      {/* Create */}
      <h1>ユーザー作成</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="名前"
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="年齢"
      />
      <button onClick={handleCreateUser}>登録</button>

      {newUser && (
        <div>
          <p>作成されたユーザー</p>
          <p>ID:{newUser.id}</p>
          <p>名前:{newUser.name}</p>
          <p>年齢:{newUser.age}</p>
        </div>
      )}

      <hr />

      {/* Update */}

      <h1>ユーザー更新</h1>
      <input
        type="number"
        value={updateId}
        onChange={(e) => setUpdateId(e.target.value)}
        placeholder="更新するID"
      />
      <input
        type="text"
        value={updateName}
        onChange={(e) => setUpdateName(e.target.value)}
        placeholder="新しい名前"
      />
      <input
        type="number"
        value={updateAge}
        onChange={(e) => setUpdateAge(e.target.value)}
        placeholder="新しい年齢"
      />
      <button onClick={handleUpdateUser}>更新</button>

      <hr />

      {/* Deleted */}

      <h1>ユーザー削除</h1>
      <input
        type="number"
        value={deleteId}
        onChange={(e) => setDeleteId(e.target.value)}
        placeholder="削除するID"
      ></input>
      <button onClick={handleDeletedUser}>削除</button><hr />


      
      <h1>ユーザー登録</h1>
      <input
        type="text"
        placeholder="名前"
        value={regName}
        onChange={(e) => setRegName(e.target.value)}
      />
      <input
        type="email"
        placeholder="メールアドレス"
        value={regEmail}
        onChange={(e) => setRegEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="パスワード"
        value={regPassword}
        onChange={(e) => setRegPassword(e.target.value)}
      />
      <input
        type="number"
        placeholder="年齢"
        value={regAge}
        onChange={(e) => setRegAge(e.target.value)}
      />
      <button onClick={handleRegister}>登録</button>
      {regMessage && <p>{regMessage}</p>}
      





    </div>

  )




}


