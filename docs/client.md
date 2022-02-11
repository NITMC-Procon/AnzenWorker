# クライアント開発用ドキュメント

クライアント環境の開発は/clientフォルダで行う。このページでは、すべて/client以下として説明を行う。

## 主要な機能

### ウィンドウ作成

ウィンドウの作成は[/Windows/Window.js](../client/Windows/Window.js)のWindowクラスをインポートすることで行う。基本的には/Windows/Window/以下に作成したアプリケーションを置く。

クラスをnewで生成することでウィンドウを画面上に出すことができる。

Windowクラスのコンストラクタにはhtml文、ウィンドウのタイトル、コンフィグを渡す。コンフィグではウィンドウに適用するcssや閉じるボタンなどの有効･無効を設定できる。

ウィンドウ全体のHTMLはthis.windowに、アプリケーションの画面(タイトルバーなどを除く)はthis.bodyElemに、タイトルのテキスト部分はthis.titleElemに格納される。これらを変更することでウィンドウに描画することができる。

ウィンドウの識別(id)にはタイトルを用いているため、標準では同じウィンドウをいくつも起動することは出来ない。コンフィグでウィンドウのIDをランダムな文字列にすることで多重起動が可能となる。Window.jsのRandomDataをインポートすると簡易的にランダムな文字列を得られる。

閉じるボタンをクリックすると、this.destructor()が呼ばれる。そこでfalseを返すとウィンドウは閉じなくなる。

以下に[/Windows/Window/Crusher.js](../client/Windows/Window/Crusher.js)の例を示す。

```javascript
export class Crusher extends Window {
    constructor() {
        super(html, "You've done", {style:style ,no_xbutton: false,no_maxmizebutton:true,no_minimizebutton:true,no_resizable:true,window_id:"Crusher"+RandomData()})
        if(this.creationFailed)return// IDが被るとcreationFailedがtrueになり、ウィンドウは作成されなくなるためここでreturnする
    }
    destructor(){
      new Crusher() //新しく自分を複製する
      return false  //ウィンドウが閉じなくなる
    }
}
```



### バックグラウンドアプリ作成

バックグラウンドアプリ(以下サービス)の作成は[/Services/ServiceClass.js](../client/Services/ServiceClass.js)のWindowクラスをインポートすることで行う。基本的には/Services/Service/以下に作成したアプリケーションを置く。

コンストラクタには値を渡す必要はなく、newでサービスを起動できる。

[/System/Desktop.js](../client/System/Desktop.js)のsystemServiceListにサービスを登録しておくと、ゲーム開始時に自動で起動するようになる。

サービス終了時にはthis.destructor()が呼ばれる。



### ファイルシステム

仮想的なファイル読み書きには[/System/FileSystem.js](../client/System/FileSystem.js)を用いる。Linuxライクなファイルシステムとなっていて、Root以下に様々なフォルダ･ファイルが出来上がる。Root.NewItem("/test/"),Root.Mkdir("test")などでフォルダが作成できる。Root.NewItem("/test")ではファイルとなる。

基本的にはItemクラスから派生したFile,Folder,Linkクラスを用いる(Linkはショートカット)。Folder.TouchやFile.Open等の関数がある(詳しくはファイル参照)

File.contentに関数が入っていると、Open時にその関数が呼ばれる。



### ネットワーク

通信には[/System/Network.js](../client/System/Network.js)を用いる。Socket.emit("eventname",data)でサーバーにデータを送信する。応答を受け取る場合は第3引数にコールバック関数を入れる。

簡易的な通信を行うために、SendTo関数を実装している。  
SendTo("targetSocketID","eventName",{...})でデータを送信すると相手側でSentToMeHandler["eventName"]が呼ばれる。予めSentToMeHandler["eventName"]に関数を入れておく必要がある。  
[/Windows/Window/Mail.js](../client/Windows/Window/Mail.js)でサンプルを確認できる。

なお、相手のSocketIDなどのデータはSocket.emit("getGameInfo",callback)とすることでcallbackに  

```
{
    "status": "status",
    "roomid": "roomid",
    "users": [
        {
            "Name": "username",
            "SocketID": "socketid"
        }
    ],
    "myID": "mysocketid"
}
```

と言った形でデータが渡されるため、ここからIDなどの情報を得ることができる。
