Taxon.class_eval do
  attachment_definitions[:icon] = (attachment_definitions[:icon] || {}).merge({
    :storage => 's3',
    :s3_credentials => Rails.root.join('config', 's3.yml')  })
end