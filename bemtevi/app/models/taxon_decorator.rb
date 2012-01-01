Taxon.class_eval do
  
  has_many :promotions, :through => :promotions_taxons
  has_many :vendors, :through => :vendors_taxons

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