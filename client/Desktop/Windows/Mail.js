'use strict'
import { Window } from "../Window.js"
import { SystemConfigs,CallWindow } from "../Desktop.js"
import { SendTo,SentToMeHandler,Socket } from "../../Functions/socket.js"
import { Notify } from "../../Functions/notify.js"

const html = `
<div style="display: flex;width: 100%;height: 100%;user-select:none;">
  <div style="width: 15em;overflow:auto;">
    <div style="display: flex;justify-content: center;align-items: center;flex-direction: row;">
        <h2 style="padding: 0.2em;margin:0;text-align: center;">受信ボックス</h2>
        <div class="file" style="display:inline-block">New</div>
    </div>
    <div>
    </div>
  </div>
  <div class="mail">
    <h1 style="margin:0;">メール</h1>
    <div>
        <span>from: </span><span></span>
        <hr>
    </div>
    <div class="file" style="display:none;"></div>
    <p style="margin:2px 0 0 0"></p>
    <div class="file" style="display:none;">削除</div>
  </div>
  <div class="mail disabled" style="display:flex;flex-direction:column;">
    <h1 style="margin:0;">新規メール</h1>
    <div>
        <span>To:</span><select></select>
    </div>
    <div>
        タイトル:<input type="text"></input>
    </div>
    <textarea style="flex:1;resize: none;width:100%;box-sizing:border-box"></textarea>
    <div>
        <div class="file">キャンセル</div>
        <div class="file">送信</div>
    </div>
  </div>
</div>
<style>
  .mailbox {
    margin: 0.2em;
    padding: 0.2em;
    background-color: rgb(235, 235, 235);
    overflow: hidden;
  }

  .mailbox>* {
    margin: 0;
    white-space: nowrap;
  }

  .mail {
    border-left: black solid 2px;
    padding-left: 0.2em;
    padding-right: 0.2em;
    width: calc(100% - 15em);
    overflow:auto;
  }

  .file {
    display: inline-block;
    padding: 0.5em 1em;
    background-color: rgb(104, 104, 104);
    color: white;
    margin: 2px;
  }
</style>`
const style="width:40em;height:20em;"

export let maillist = [
    {
        sub:"テストメール",
        from:"asdiuq@fuckdns.omg",
        text:`先生へ

        4Fの太郎です。
        
        例の物を添付ファイルとしてお送り致します。
        ご確認の方よろしくお願いします。
        
        舞鶴工業高等専門学校 機械制御情弱科 4年 舞鶴 太郎
        Email: taro@maizuru.kosen.ac.jp`,
        file:{
            name:"file.exe",
            func:()=>{ CallWindow("Crusher",Math.random())}
        }
    },
    {
        sub:"メール",
        from: "test@example.com",
        text: `てすと`
    }, {
        sub: "アンバサダープログラムへの勧誘",
        from:"asdvbsdfwaq@fuckdns.omg",
        text: "いつもお世話になっております。\nOO商業です。\nこの度あなたは特別なプログラムの参加可能メンバーに選ばれました。\nぜひ参加をご検討ください。"
    }, {
        sub: "限りある資源を大切に使う、やさしい生活　サステナブルなお買いもの特集",
        from:"eco@echo.eco",
        text: " 画像\n繰り返し使える「エコグッズ」や、\n美味しく食べられる「訳あり食材」など、\n環境のことを考えるアイテムをご紹介\nPoyPoyフリマのお買いもので、\n日々の生活を少しだけ変えてみよう！\n\n発行：ヤホー株式会社\n住所：○○都○○区○○町○番○号\n編集：PoyPoyフリマ\n発行日：○○○○年 ○月 ○日"
    }, {
        sub: "PoiPoyフリマおすすめ情報メール",
        from:"magagine@poipoy.com",
        text: "いつもサービスをご愛顧いただきありがとうございます。\nPoiPoyフリマでは、期間限定キャンペーンとして、『半額くじ』を実施しております。\n期間中に、PoyPoyフリマ　アプリで購入すると、\n購入額の半額相当分のボーナスがもらえるチャンスです。\n毎日当せんのチャンスがありますので、ぜひこの機会に、\nPoyPoyフリマでのお買いものをお楽しみください。\n\n◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇\n\nまた、期間中ほかにもお得なキャンペーンを開催しております。\nぜひご確認ください。\n※詳細はこちら\n以上、今後も弊社サービスをご利用くださいますよう、\nよろしくお願いいたします。"
    }, {
        sub: "メールマガジンの開始について",
        from:"tarou@maizuru.omg",
        text: "株式会社○○\n○○ ○○様\n\n大変ご無沙汰しております。\n株式会社××の舞鶴太郎です。\n\nこの度、弊社では過去に資料請求をしていただいた方に対し、\nメールマガジンでフォローをさせていただくことになりました。\n\n最新の研修動向、論文の上手な書き方\n最新データなど、お楽しみいただけたらと思います。\n\n配信は、毎週土曜日の8時頃を予定しております。\n\nなお、いきなり送信してしまうと失礼になりますので、\n大変お手数ですが、不要な方は以下のURLから解除をお願い致します。\n\nhttps://www.maizuru-ct.ac.jp/\n\nそれでは、来週の月曜日をお待ちください。\n\n引き続きよろしくお願いいたします。\n\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n株式会社××　舞鶴 太郎\n住所\n電話番号\nメールアドレス\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
    }, {
        sub: "営業時間短縮のお知らせ",
        from:"jirou@maizuru.omg",
        text: "株式会社○○\n○○ ○○様\n\nいつもお世話になっております。\n株式会社△△の舞鶴次郎です。\n\nこのたびは弊社の営業時間短縮のご連絡でメールをいたしました。\n\n弊社の営業時間（平日10:00～20:00）につきまして、\n営業時間を１時間短縮し平日10:00～19:00までといたします。\nお客さまには大変ご迷惑をおかけいたしますが\n今後ともスタッフ一同さらに丁寧なサービスを心がけて参ります。\n引き続きよろしくお願いいたします。\n"
    }, {
        sub: "抽選結果のお知らせ",
        from:"ahoo@maizuru.omg",
        text: "株式会社○○\n○○様\n\nお世話になっております。\n○○株式会社△△でございます。\n\nこの度は、○○年○○月○○日（○）\n弊社主催の「ko-sen祭り」にお申し込みいただき\n誠にありがとうございました。\n厳正に抽選させていただいた結果、\n誠に残念ですが落選となりました。\n\n興味を持ってお申込みをいただきましたのに、\nお断りせざるを得ない状況になり、\n本当に申し訳ございません。\n\nまた同様のイベントを開催の際には\n\n改めてご案内させていただきます。\n\n今後ともどうぞよろしくお願いいたします。\n\n-----------------------------------------------------\n○○株式会社　△△課\n担当：舞　鶴太郎\nTEL：○○-○○○-○○○○\nFAX：○○-○○○-○○○○\nE-mail：△△@△△.co.jp\nhttp://△△○○～\n-----------------------------------------------------\n"
    }, {
        sub: "ホームページ開設のお知らせ",
        from:"tarou@maizuru.omg",
        text: "いつも大変お世話になっております。\n株式会社△△広報部の○○太郎です。\n平素は、格別のご高配にあずかり厚く御礼申し上げます。\n\nさて、弊社では以前より準備を進めておりました、\nホームページを本日付で正式に立ち上げました。\n アドレスは以下の通りです。\n\nhttps://www.maizuru-ct.ac.jp/\n引き続き皆様へのサービス向上に努めるべく、\nホームページの見直し、コンテンツの充実をはかって\nまいりたいと存じます。\n\nこの件で何かご不明な点がありましたら、\nお気軽にお問い合わせください。\n\n今後とも弊社並びに、弊社製品を\nどうぞよろしくお願いいたします。\n-------------------------------------------\n株式会社△△　広報部\n舞鶴　史郎\n住所：〒111-1111　東京都◎◎区◎◎町1-2-3\nTEL：03-****-****　／　FAX：03-****-****\nURL：http://www.***.co.jp\nMail:◎◎@***.co.jp\n-------------------------------------------\n"
    }, {
        sub: "出荷のご案内",
        from:"tarou@maizuru.omg",
        text: "株式会社○○\n◇◇◇◇様\n\nいつもお世話になっております。\n株式会社△△の◎◎太郎です。\n\n○○月○○日付でご注文いただきました製品について、\n本日以下のとおり発送いたしました。\n\n---------------------------------------------\nご注文内容：○○○○\nご注文個数：○○個\n---------------------------------------------\n\nなお、製品の到着をご確認いただけましたら\nお手数ですが同封の受領書をご返送くださいますよう\nよろしくお願いいたします。\n\n＜同封物＞\n（1）納品書...1通\n（2）受領書...1通\n\nご不明な点がおありでしたらお気軽にご連絡ください。\nよろしくお願いいたします\n----------------------------------------------------\n株式会社△△　◎◎部 ○○太郎\n住所：〒111-1111　東京都◎◎区◎◎町1-2-3\nTEL：03-****-****　／　FAX：03-****-****\nMail:◎◎@***.co.jp\n----------------------------------------------------\n"
    }, {
        sub: "商品発送のご連絡",
        from:"noreply@takuhai.omg",
        text: "◇◇◇◇様\n\nご利用いただきありがとうございます。\n\n○月○日（○曜日）にご注文いただきました△△を\n×月×日（×曜日）×時の便で発送いたしました。\n\n貴社への到着は、明日の昼頃を予定しております\n。念のため、詳細を以下の通りまとめました。\nご確認よろしくお願いいたします。\n-----------------------------\n商品：△△\n数量：□□個\n到着日：◇月◇日（◇曜日）◇時（予定）\n発送番号：11-1111-XXXX\n-----------------------------\n\nご不明な点やご質問がございましたら、お気軽にご連絡ください。\nよろしくお願いいたします。\n\n----------------------------------------------------\n\n株式会社△△ ◎◎部 ○○太郎\n住所：〒111-1111　東京都◎◎区◎◎町1-2-3\nTEL：03-****-****　／　FAX：03-****-****\nMail:○○@example.co.jp\n----------------------------------------------------"
    }, {
        sub: "セミナー開催中止のお知らせ",
        from:"noreply@kabusiki.omg",
        text: "株式会社●●●●\n●●●●様\n\nお世話になっております。\n\n●月●日（●曜日）開催「●●セミナー」についてご連絡いたします。\n\n新型コロナウイルス感染症（COVID-19）の動向に鑑みて、\nセミナーの開催を中止させていただくことになりました。\n\nすでにお申し込みが完了している段階でのご連絡となり\n大変恐縮ですがご理解いただけると幸いです。\n\n今後の状況に応じて改めて企画を検討し、ご連絡いたします。\n\nご迷惑をおかけして恐縮ですが、ご理解とご了承のほど、\nよろしくお願いいたします。\n\nお手数ですが、お申し込み内容をご確認の上、\n以下の●●●●をご入力の上、そのままご返信ください。\n\n----------------------------\n●申込内容\n----------------------------\n【講座名】●●セミナー\n【日時】2020年02月13日（木）10:00〜13:00\n【受講人数／受講料】1名　\n-----------------------------------\n\nご不明な点やご質問がございましたら、お気軽にご連絡ください。\nよろしくお願いいたします。\nそれでは、よろしくお願いいたします。\n"
    }, {
        sub: "【重要】営業会議のお知らせ（〇月〇日）",
        from:"hanako@eigyou.kabusiki.omg",
        text: "関係者各位\n\nお疲れさまです。\n営業部の舞鶴花子です。\n\n〇月の営業会議を下記要項にて行います。\n日程調整のうえ、必ずご参加ください。\n\n■会議の詳細\n・日時：〇月〇日（〇）１５時～１７時\n・場所：本社５階　第３会議室\n・議題：新商品〇〇の販促に関して\n\nなお、会議資料を添付しておりますので、\n事前にご確認のうえ、プリントしご持参ください。\n\nやむを得ない事情により出席できない方は\n〇月〇日までに、〇〇までご返信ください。\n\n以上、宜しくお願い申し上げます。\n\n----------------------------------------------------\n\n株式会社△△ ◎◎部 舞鶴花子\n住所：〒111-1111　京都府舞鶴市◎◎町123\nTEL：000-****-****　／　FAX：03-****-****\nMail:○○@example.co.jp\n----------------------------------------------------"
    }, {
        sub: "御見積書（oooo）ご送付",
        from:"tarou@nbm.omg",
        text: "株式会社●●●●\n●●●●様\n\nお世話になっております。\n一般社団法人日本ビジネスメール協会の山田太郎です。\n\nこのたびはお見積もりのご依頼ありがとうございます。\n\n●●●●の御見積書を添付にてお送りいたします。\n（添付ファイル：【御見積書】株式会社●●●●御中.pdf）\n\n＜内容＞\n・数量：300個\n・単価：●●●●円（税別）\n\n通常はご注文いただいてから約2週間で納品可能です。\nただ、毎月、最終週は注文が集中するため、\n納品までに3週間ほど頂戴することがあります。\n\nできるだけご希望の期日に納品できるよう手配させていただきますので、\n●月●日（銀）までにご返答いただけると幸いです。\n\nよろしくお願いいたします。\n\n鶴　舞太郎\nTEL：○○-○○○-○○○○\nFAX：○○-○○○-○○○○\nE-mail：△△@△△.co.jp\nhttp://△△○○～\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
    }, {
        sub: "【○○ショップ】プレゼント当選のお知らせ",
        from:"noreply@ooshop.omg",
        text: "△△△△様\n\nいつも当店をご利用いただきましてありがとうございます。\n○○ショップです。\n\nこのたびは「○○○○プレゼントキャンペーン」に\nご応募くださいまして誠にありがとうございました。\n\n今回、○賞の「○○○○○○○○」が当選いたしましたので\nお知らせのメールをいたしました。\n\n発送は3週間後～1ヶ月後となります。\n楽しみにお待ちください。\n（※諸事情により、多少前後する場合もございます。\nあらかじめご了承ください。）\n\n引き続き当店をご愛顧いただきますよう\nよろしくお願いいたします。\n\n----------------------------------------------------\n○○ショップ\nURL：http://www.***.co.jp\n\n営業日：月～金○○：○○～○○：○○\n定休日：土日祝\n定休日にいただいたご連絡に関しましては\n翌営業日にご回答させていただきます。\n\n株式会社△△\n住所：〒111-1111　東京都◎◎区◎◎町1-2-3\nTEL：03-****-****　／　FAX：03-****-****\n店舗連絡先:◎◎@***.co.jp\n----------------------------------------------------"
    }, {
        sub: "○○の仕様書送付のお願い",
        from:"kotarou@oobussan.omg",
        text: "○○株式会社 営業部\n○○ ○○ 様\n\nいつもお世話になっております\n株式会社○○物産 開発部の舞鶴 工太郎です。\n\n先日のミーティングの際にご提案いただきました○○について、\n前向きに導入を検討したいと考えております。\n\nそこで社内での説明のために、○○の仕様書をメールにて\nお送りいただくことは可能でしょうか。\n\nお手数をおかけいたしますが、何卒よろしくお願いいたします。\n\n*************************************\n株式会社 ○○物産\n開発部 舞鶴 工太郎\n〒○○○　東京都○○区○○町○-○-○\nTEL：○○　FAX：○○\nメールアドレス：○○\nURL：http://○○○\n*************************************\n"
    }, {
        sub: "○○の仕様についてのお問い合わせ",
        from:"kotarou@oobussan.omg",
        text: "○○株式会社 営業部\n○○ ○○ 様\n\nいつもお世話になっております。\n株式会社○○物産 開発部の舞鶴 工太郎です。\n\n先日のミーティングの際にご提案いただきました○○について、\n前向きに導入を検討したいと考えております。\n\nそこで社内での説明のために、○○の仕様について、以下2点を\n確認させていただけますでしょうか。\n\n1. ○○○\n2. ○○○\n\nお手数をおかけいたしますが、何卒よろしくお願いいたします。\n\n*************************************\n株式会社 ○○物産\n開発部 舞鶴 工太郎\n〒○○○　東京都○○区○○町○-○-○\nTEL：○○　FAX：○○\nメールアドレス：○○\nURL：http://○○○\n*************************************\n"
    }, {
        sub: "○○に関する回答について",
        from:"kotarou@oobussan.omg",
        text: "○○株式会社 営業部\n○○ ○○ 様\n\nいつもお世話になっております。\n株式会社○○物産 開発部の舞鶴 工太郎です。\n\n早速ではございますが、先日お問い合わせいたしました\n○○の回答の状況はいかがでしょうか。\n\n○○の導入についての社内会議を○月△日に行う予定ですので、\nお忙しいところ恐縮ではございますが、\nその前日までに回答いただけると幸いです。\n\n何卒、よろしくお願いいたします。\n\n株式会社 ○○物産\n開発部 舞鶴 工太\n〒○○○　京都府舞鶴市○○町○-○-○\nTEL：○○　FAX：○○\nメールアドレス：○○\nURL：http://○○○\n*************************************\n"
    }, {
        sub: "△△の打ち合わせのお礼",
        from:"maizuru@oosha.omg",
        text: "株式会社〇〇　〇〇様\n\nいつも大変お世話になっております。\n株式会社〇〇の舞鶴です。\n\nこの度は、お忙しい中、貴重な時間を割いていただき誠にありがとうございました。\nこの度△△について〇〇様から詳しくお話をお伺いすることができ、大変参考になりました。 打ち合わせの中でいただいたご要望やご意見をまとめて、さらに△△の製品制度を高めていく所存でございます。\n\nまた、ご不明な点等ございましたらご連絡ください。\n今後とも、どうぞよろしくお願い申し上げます\n\n----------------------------------------------------\n株式会社△△ ◎◎部 舞鶴　工子\n住所：〒111-1111　京都府舞鶴市◎◎町123\nTEL：000-****-****　／　FAX：03-****-****\nMail:○○@example.co.jp\n----------------------------------------------------"
    }, {
        sub: "商品サンプルの件",
        from:"yamada@oosha.omg",
        text: "株式会社〇〇　〇〇様\n\nいつも大変お世話になっております。\n株式会社〇〇の山田です。\n\n先日メールにてお願いしておりました△△の商品サンプルの件についてですが、\nその後の進捗は、いかがでしょうか。\n当サンプルが必要となる会議が今週金曜日と迫っているため、本日15時までにご送付をお願いできますでしょうか。\n\nまた、本メールと行き違いでご連絡をいただいておりましたら申し訳ありません。\nお忙しいところ大変恐れ入りますが、お取り計らいの程、何卒よろしくお願いいたします。\n----------------------------------------------------\n株式会社△△　◎◎部 ○○太郎\n住所：〒111-1111　東京都◎◎区◎◎町1-2-3\nTEL：03-****-****　／　FAX：03-****-****\nMail:◎◎@***.co.jp\n----------------------------------------------------\n"
    }]


export class Mail extends Window{
    constructor(parent){
        super(html,"メール",parent,{style:style});
        
        /** @type {HTMLElement} *///@ts-ignore
        this.maillist = this.bodyElem.firstElementChild.firstElementChild.lastElementChild
        /** @type {HTMLElement} *///@ts-ignore
        this.mailtitlearea = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.firstElementChild
        /** @type {HTMLElement} *///@ts-ignore
        this.mailfromarea = this.mailtitlearea.nextElementSibling.firstElementChild.nextElementSibling
        /** @type {HTMLElement} *///@ts-ignore
        this.mailfilearea = this.mailtitlearea.nextElementSibling.nextElementSibling
        /** @type {HTMLElement} *///@ts-ignore
        this.mailtextarea = this.mailfilearea.nextElementSibling
        /** @type {HTMLElement} *///@ts-ignore
        this.maildelbutton = this.mailtextarea.nextElementSibling

        /** @type {HTMLElement} *///@ts-ignore
        this.mailarea =  this.bodyElem.firstElementChild.firstElementChild.nextElementSibling

        /** @type {HTMLInputElement} *///@ts-ignore
        this.mailrefresh =  this.bodyElem.firstElementChild.firstElementChild.firstElementChild.firstElementChild

        /** @type {HTMLElement} *///@ts-ignore
        this.newmailarea =  this.mailarea.nextElementSibling
        /** @type {HTMLInputElement} *///@ts-ignore
        this.newmailbutton =  this.bodyElem.firstElementChild.firstElementChild.firstElementChild.lastElementChild
        /** @type {HTMLInputElement} *///@ts-ignore
        this.newmailto =  this.newmailarea.firstElementChild.nextElementSibling.lastElementChild
        /** @type {HTMLInputElement} *///@ts-ignore
        this.newmailsub =  this.newmailarea.firstElementChild.nextElementSibling.nextElementSibling.lastElementChild
        /** @type {HTMLInputElement} *///@ts-ignore
        this.newmailtext =  this.newmailarea.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling
        /** @type {HTMLInputElement} *///@ts-ignore
        this.newmaildelbutton =  this.newmailtext.nextElementSibling.firstElementChild
        /** @type {HTMLInputElement} *///@ts-ignore
        this.newmailsendbutton =  this.newmaildelbutton.nextElementSibling

        Socket.emit("getGameInfo",(res)=>{
            this.newmailfrom = res.myID
            this.newmailto.innerHTML = ""
            let temp = ""
            if(res.users){
                res.users.forEach((user)=>{
                    if(user.SocketID != this.newmailfrom) temp += `<option value="${user.SocketID}">${user.Name?user.Name:user.SocketID}</option>`
                })
                this.newmailto.innerHTML = temp
            }
        })

        this.refreshMails()
        
        this.mailfilearea.addEventListener('click',()=>{
            this.openfile()
        })
        this.maildelbutton.addEventListener('click',()=>{
            this.deleteMail()
        })
        this.newmailbutton.addEventListener('click',()=>{
            this.mailarea.classList.add("disabled")
            this.newmailarea.classList.remove("disabled")
        })
        this.newmaildelbutton.addEventListener('click',()=>{
            this.mailarea.classList.remove("disabled")
            this.newmailarea.classList.add("disabled")
        })
        this.newmailsendbutton.addEventListener('click',()=>{
            this.send()
            this.mailarea.classList.remove("disabled")
            this.newmailarea.classList.add("disabled")
        })
        this.mailrefresh.addEventListener('click',()=>{
            this.refreshMails()
        })
    }
    send(){
        let sub = this.newmailsub.value
        let to = this.newmailto.value
        let text = this.newmailtext.value
        if(!to){
            Notify("送信先が見つかりませんでした")
            return
        }
        SendTo(to,{event:"newMail",arg:{
            sub:sub,
            from:this.newmailfrom,
            text:text
        }})
        this.newmailsub.value = ""
        this.newmailto.value = ""
        this.newmailtext.value = ""
    }
    select(mail){
        this.keep = mail
        this.mailtitlearea.textContent = mail.sub?mail.sub:""
        //@ts-ignore
        this.mailtextarea.innerText = mail.text?mail.text:""
        this.mailfromarea.innerText = mail.from?mail.from:""
        if(mail.file){
            this.mailfilearea.style.display=""
            this.mailfilearea.textContent = mail.file.name;
        }else{
            this.mailfilearea.style.display="none"
        }
        this.maildelbutton.style.display=(mail?"":"none")
    }
    openfile(){
        if(this.keep && this.keep.file.func){
            this.keep.file.func()
        }
    }
    deleteMail(){
        maillist = maillist.filter((item)=> {
            return item !== this.keep;
        });
        this.select([])
        this.refreshMails()
    }
    refreshMails(){
        this.maillist.innerHTML=""
        maillist.forEach((mail) =>{
            let temp = createElementFromHTML(`<div class="mailbox">
                    <p>${mail.from}</p>
                    <p>${mail.sub}</p>
                    <p style="color:gray">${mail.text}</p>
                </div>`)
            temp.addEventListener('click',()=>{
                this.select(mail)
            })
            this.maillist.insertAdjacentElement('beforeend',temp)
        })
    }
}

function createElementFromHTML(html) {
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstElementChild;
}

SentToMeHandler["newMail"] = (mail)=>{
    maillist.push(mail)
}