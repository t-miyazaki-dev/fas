import { promises as fs} from "fs";

async function writeMyFile(fileName: string,content: string){
    try{
        await fs.writeFile(fileName,content,"utf8");
        console.log(`ファイル「${fileName}」への書き込みが完了しました。`);
    }catch(err){
        console.error('書き込み中にエラーが発生しました:',err);
    }
}


writeMyFile("hello.txt",'これはESMで非同期に書き込まれたファイルです。');
