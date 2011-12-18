PromotionImage.class_eval do
  
  attachment_definitions[:attachment] = (attachment_definitions[:attachment] || {}).merge({
    :storage => 's3',
    :s3_credentials => Rails.root.join('config', 's3.yml')
  })
  
end