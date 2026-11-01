# キャリアクエスト かんたん診断

ユーザー提供の改修指示書に基づく10問の「松・竹・梅」診断。各回答1点、最高点の全タイプを提案として表示します。結果は能力や価値の判定ではありません。

サイト内の診断：https://career-quest-journey.emiruka.chatgpt.site/diagnosis.html

従来URLの利用者のため、GitHub Pagesでも同じ診断を提供します。回答はsessionStorageでこのタブ内だけ保持し、外部送信しません。開始・完了・CTAのイベントをdataLayerに追加しますが、計測先IDは未設定です。フォーム遷移は申込完了として扱いません。

申込先：https://forms.gle/j3YSga7YkyxfVhpB7 （Googleログインが必要）

ブラウザで index.html を開くか、静的ホスティングで公開してください。外部ライブラリ・ビルドは不要です。

quiz-data.jsが質問・結果コメント・採点・復元検証、quiz.jsがUI、site.jsがCTAとイベント、style.cssが表示を担当します。ホームページ側の同名ファイルと同期してください。ホームへのリンクはindex.htmlのdata-homeと初期hrefに絶対URLを設定しています。
