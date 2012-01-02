Taxon.class_eval do
  
  has_and_belongs_to_many :promotions
  has_and_belongs_to_many :vendors

  attachment_definitions[:icon] = (attachment_definitions[:icon] || {}).merge({
    :default_url => ""
  })

  def icon_url
    icon.url(:original)
  end

end