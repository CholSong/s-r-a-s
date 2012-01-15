Taxon.class_eval do
  
  has_and_belongs_to_many :promotions
  has_and_belongs_to_many :vendors
  
  attachment_definitions[:icon] = (attachment_definitions[:icon] || {}).merge({
    :storage => 's3',
    :s3_credentials => Rails.root.join('config', 's3.yml')  })
end