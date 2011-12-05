Image.class_eval do
  
  attr_accessor :content_type, :original_filename, :image_data
  
  attachment_definitions[:attachment] = (attachment_definitions[:attachment] || {}).merge({
    :storage => 's3',
    :s3_credentials => Rails.root.join('config', 's3.yml')
  })
  
end