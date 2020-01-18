json.array! @messages do |message|
  # ↑：@messageは、api/message_ontroller.rbから送られてきた、
  # last_message_より大きいidが大きい
  # messageが格納されている。
  json.content message.content
  json.image message.image.url
  json.created_at message.created_at.strftime("%Y年%m月%d日 %H時%M分")
  json.user_name message.user.name
  json.id message.id
end