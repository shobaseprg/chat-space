$(function(){
  function buildHTML(message){
    if ( message.image ) {
      var html =
      `<div class="main-chat__message-list__message-box">
        <div class="main-chat__message-list__message-box__name-date">
          <p class="name">
            ${message.user_name}
          </p>
          <p class="date">
            ${message.created_at}
          </p>
        </div>
        <p class = "message">
        <p class="lower-message__content">
          ${message.content}
        </p>
        <img class ="lower-message__image" src="${message.image}"></img>
      </div>`
      return html;
    } else{
      var html =
      `<div class="main-chat__message-list__message-box">
        <div class="main-chat__message-list__message-box__name-date">
          <p class="name">
            ${message.user_name}
          </p>
          <p class="date">
            ${message.created_at}
          </p>
          <p></p>
      </div>
      <p class="lower-message__content">
      ${message.content}
      </p>
      </div>`
      return html;
    };
  }

  $('#new_message').on('submit', function(e){
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
      var html = buildHTML(data);
      $('.main-chat__message-list').append(html);
      $('.main-chat__message-list').animate({ scrollTop: $('.main-chat__message-list')[0].scrollHeight});      
      $('form')[0].reset();
      $('.form__submit').prop("disabled", false);
      console.log("heloo")
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
    });
  })

});