Taxon.class_eval do
  
  has_and_belongs_to_many :promotions
  has_and_belongs_to_many :vendors

  attachment_definitions[:icon] = (attachment_definitions[:icon] || {}).merge({
    :default_url => ""
  })
  
  # use deleted? rather than checking the attribute directly. this
  # allows extensions to override deleted? if they want to provide
  # their own definition.
  def deleted?
    !!deleted_at
  end
  
  def icon_url
    icon.url(:original)
  end

end