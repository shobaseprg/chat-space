$(function(){
  
  var reloadMessages = function() {
    last_message_id = $('.message:last').data("message-id");    //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
  // .messageというクラスがつけられた全てのノードのうち一番最後のノード、という意味になります。
  // （/Users/us/projects/chat-space/app/views/messages/_message.html.haml 参照）
  console.log(last_message_id);
    $.ajax({
      url: "api/messages",//ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
      type: 'get',      //ルーティングで設定した通りhttpメソッドをgetに指定
      dataType: 'json',
      data: {id: last_message_id}      //dataオプションでリクエストに値を含める
    })
    .done(function(messages) {
      if (messages.length !== 0) {
      // messagesには、controllers/api/messageコントローラーから送られてきたidが最終のidより大きいメッセージが配列で挿入されている。
        var insertHTML = '';       //追加するHTMLの入れ物を作る
        $.each(messages, function(i, message) {   //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
          insertHTML += buildHTML(message)
        });
        $('.main-chat__message-list').append(insertHTML);  // htmlをmain-chat__message-listの最後尾に挿入
        $('.main-chat__message-list').animate({ scrollTop: $('.main-chat__message-list')[0].scrollHeight});
        $('form')[0].reset();
        $('.form__submit').prop("disabled", false);
        }
    })
    .fail(function() {
      console.log('error');
    });
  };

  var buildHTML = function(message) {    // builHTMLを引数message ← data を用いて呼び出す
                                         // function(message)は message を用いてhtmlを非同期で組み立てるメソッド
    if (message.content && message.image) {   // メッセージと画像があった場合
      var html = `<div class="message" data-message-id=` + message.id + `>
      <div class="main-chat__message-list__message-box">
        <div class="main-chat__message-list__message-box__name-date">
          <p class="name">
            ${message.user_name}
          </p>
          <p class="date">
            ${message.created_at}
          </p>
        </div>
        <p class = "message-content">
          <p class="lower-message__content">
            ${message.content}
          </p>
        </p>
        <img class ="lower-message__image" src="${message.image}"></img>
      </div>`
    } 
    else if(message.content) {    // メッセージのみがあった場合
      var html = `<div class="message" data-message-id=` + message.id + `>
      <div class="main-chat__message-list__message-box">
        <div class="main-chat__message-list__message-box__name-date">
          <p class="name">
            ${message.user_name}
          </p>
          <p class="date">
            ${message.created_at}
          </p>
        </div>
        <p class = "message-content">
          <p class="lower-message__content">
            ${message.content}
          </p>
        </p>
      </div>`
    } 
    else if (message.image) { // 画像のみがあった場合
      var html = `<div class="message" data-message-id=` + message.id + `> 
      <div class="main-chat__message-list__message-box">
        <div class="main-chat__message-list__message-box__name-date">
          <p class="name">
            ${message.user_name}
          </p>
          <p class="date">
            ${message.created_at}
          </p>
        </div>
        <img class ="lower-message__image" src="${message.image}"></img>
      </div>`
    };
    return html;
  };

  $('#new_message').on('submit', function(e){   // #new_messageにおいてsubmit されたら発火
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);  // json化されたdataを用いて、buildHTMLを呼び出し html に挿入
      $('.main-chat__message-list').append(html);  // htmlをmain-chat__message-listの最後尾に挿入
      $('.main-chat__message-list').animate({ scrollTop: $('.main-chat__message-list')[0].scrollHeight});
      $('form')[0].reset();
      $('.form__submit').prop("disabled", false);
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
    });
  })
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});