Taxon.class_eval do

  attachment_definitions[:icon] = (attachment_definitions[:icon] || {}).merge({
    :default_url => ""
  })

  def icon_url
    icon.url(:original)
  end
  
  def vendor
    { :id => self.id, 
      :name => self.name }
  end

end